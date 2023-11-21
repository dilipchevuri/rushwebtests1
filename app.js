import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/service", (req, res) => {
  res.render("services.ejs");
});


//Mailchimp api code
app.use(express.json()); // Parse JSON request bodies

// Handle form submissions
app.post('/subscribe', async (req, res) => {
  try {
    const apiKey = process.env.MAILCHIMP_API_KEY;
    //const apiKey = "5e32ac3d828b9c308e642005a4a27360-us8"
    const listId = process.env.MAILCHIMP_LIST_ID; 
    //const listId = "8b8bf9d05f"

    // Get the form data
    const { name, email, subject, message } = req.body;

    // Create the JSON data for the Mailchimp API request
    const data = {
      email_address: email,
      status: 'subscribed', // or 'pending' if you want double opt-in
      merge_fields: {
        NAME: name,
        SUBJECT: subject,
        MESSAGE: message,
      },
    };
    // 5e32ac3d828b9c308e642005a4a27360-us8
    // Make a POST request to the Mailchimp API
    const response = await fetch(`https://us8.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    // Handle the Mailchimp API response
    if (responseData.status === 'subscribed') {
      // Successful subscription
      res.render("contact.ejs");
    } else {
      // Handle errors or other statuses
      res.render("contact.ejs");
    }
  } catch (error) {
    // Handle any network or API errors
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});





