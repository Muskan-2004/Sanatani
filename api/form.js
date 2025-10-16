// api/form.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  const accessKey = process.env.key;

  if (!accessKey) {
    console.error("❌ WEB3FORMS_KEY is not defined!");
    return res.status(500).json({ message: "Missing access key" });
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      access_key: accessKey,
      from_name: name,
      name: name,
      email: email,
      message: message,
      subject: `New message from ${name}` // Add a default subject
    })
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}