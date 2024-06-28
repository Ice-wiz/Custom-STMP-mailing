import { simpleParser } from 'mailparser';
import Imap from 'imap-simple';
import imapConfig from './imapConfig';
import { MongoClient } from 'mongodb';
import { flattenDeep } from 'lodash';

const clientPromise = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).connect();


const getParts = (parts) => {
    return flattenDeep(parts.map(part => {
        if (part.parts) {
            return getParts(part.parts);
        }
        return part;
    }));
};

const checkForEmails = async () => {
    try {
        
        const connection = await Imap.connect({ imap: imapConfig.imap });
        await connection.openBox('INBOX');

     
        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            struct: true, 
            markSeen: true 
        };

        const results = await connection.search(searchCriteria, fetchOptions);

     
        console.log('Fetched results:', JSON.stringify(results, null, 2));

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db();
        const receivedCollection = db.collection('receivedEmails');
        const sentCollection = db.collection('sentEmails');

     
        const sentEmails = await sentCollection.find().toArray();

        for (const item of results) {
            
            console.log('Processing item:', JSON.stringify(item, null, 2));

            // Extract email headers
            const headerPart = item.parts.find(part => part.which === 'HEADER');
            const headers = headerPart ? headerPart.body : {};
            const subject = headers.subject ? headers.subject[0] : 'No subject';
            const from = headers.from ? headers.from[0] : 'Unknown sender';
            const matches = from.match(/^(.+) <(.+)>$/);
            const name = matches ? matches[1] : from;
            const email = matches ? matches[2] : '';

          
            console.log(`Email subject: ${subject}`);

            
            const matchingSentEmail = sentEmails.find(sentEmail => sentEmail.recipient === email);
            if (!matchingSentEmail) {
                console.log(`Email from ${from} not found in sent emails. Skipping.`);
                continue;
            }

           
            const referenceCodes = sentEmails.map(sentEmail => sentEmail.referenceCode);
            const foundReference = referenceCodes.some(code => {
                const regex = new RegExp(`\\[${code}\\]`, 'i');
                return regex.test(subject);
            });

            if (!foundReference) {
                console.log(`Email subject does not contain any reference code from sent emails. Skipping.`);
                continue;
            }

            
            const bodyPart = item.parts.find(part => part.which === 'TEXT');
            const mail = await simpleParser(bodyPart.body);

        
            const bodyLines = mail.text ? mail.text.split('\n') : [];
            const body = bodyLines.length > 0 ? bodyLines[0] : 'No body';

     
            const emailDocument = {
                from,
                name,
                email,
                subject,
                body,
                date: mail.date || new Date(),
                attachments: []
            };

            // in case there are attachmants then we can extract attachments

            const parts = getParts(item.attributes.struct);
            const attachmentPromises = parts.filter(part => part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT')
                .map(part => connection.getPartData(item, part)
                    .then(partData => ({
                        filename: part.disposition.params.filename,
                        data: partData
                    }))
                );

            // Resolving all attachment promises

            const attachments = await Promise.all(attachmentPromises);
            emailDocument.attachments = attachments;

            
            await receivedCollection.insertOne(emailDocument);

            console.log(`Stored email from: ${from} with subject: ${subject}`);
        }

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error receiving emails:', error);
    }
};

export default checkForEmails;



// import { simpleParser } from 'mailparser';
// import Imap from 'imap-simple';
// import imapConfig from './imapConfig';
// import clientPromise from './mongodb';
// import { flattenDeep } from 'lodash'; // Import lodash's flattenDeep method

// // Utility function to extract parts of an email
// const getParts = (parts) => {
//     return flattenDeep(parts.map(part => {
//         if (part.parts) {
//             return getParts(part.parts);
//         }
//         return part;
//     }));
// };

// const checkForEmails = async () => {
//     try {
//         // Connect to IMAP
//         const connection = await Imap.connect({ imap: imapConfig.imap });
//         await connection.openBox('INBOX');

//         // Search for unseen emails
//         const searchCriteria = ['UNSEEN'];
//         const fetchOptions = {
//             bodies: ['HEADER', 'TEXT', ''],
//             struct: true, // Fetch the structure of the email to access attachments
//             markSeen: true // Mark emails as seen after fetching
//         };

//         const results = await connection.search(searchCriteria, fetchOptions);

//         // Log the results to understand the structure
//         console.log('Fetched results:', JSON.stringify(results, null, 2));

//         // Connect to MongoDB
//         const client = await clientPromise;
//         const db = client.db();
//         const collection = db.collection('receivedEmails');

//         for (const item of results) {
//             // Log the item to see its structure
//             console.log('Processing item:', JSON.stringify(item, null, 2));

//             // Extract email headers
//             const headerPart = item.parts.find(part => part.which === 'HEADER');
//             const headers = headerPart ? headerPart.body : {};
//             const subject = headers.subject ? headers.subject[0] : 'No subject';
//             const from = headers.from ? headers.from[0] : 'Unknown sender';

//             // Extract body text
//             const bodyPart = item.parts.find(part => part.which === 'TEXT');
//             const mail = await simpleParser(bodyPart.body);

//             // Extract the first line of the body for a summary
//             const bodyLines = mail.text ? mail.text.split('\n') : [];
//             const body = bodyLines.length > 0 ? bodyLines[0] : 'No body';

//             // Prepare the email document to be saved
//             const emailDocument = {
//                 from,
//                 subject,
//                 body,
//                 date: mail.date || new Date(),
//                 attachments: []
//             };

//             // Extract attachments
//             const parts = getParts(item.attributes.struct);
//             const attachmentPromises = parts.filter(part => part.disposition && part.disposition.type.toUpperCase() === 'ATTACHMENT')
//                 .map(part => connection.getPartData(item, part)
//                     .then(partData => ({
//                         filename: part.disposition.params.filename,
//                         data: partData
//                     }))
//                 );

//             // Resolve all attachment promises
//             const attachments = await Promise.all(attachmentPromises);
//             emailDocument.attachments = attachments;

//             // Insert the email document into MongoDB
//             await collection.insertOne(emailDocument);

//             console.log(`Stored email from: ${from} with subject: ${subject}`);
//         }

//         // Close the connection
//         await connection.end();
//     } catch (error) {
//         console.error('Error receiving emails:', error);
//     }
// };

// export default checkForEmails;
