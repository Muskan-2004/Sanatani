export default async function handler(req, res) {
    console.log("OK")
      console.log("Method:", req.method);
  console.log("Body:", req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  const accessKey = process.env.key;

  if (!accessKey) {
    console.error("❌ WEB3FORM_KEY is not defined!");
    return res.status(500).json({ message: "Missing access key" });
  }

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      access_key: accessKey,
      from_name: name, // Now using full_name
      name,
      email,
      message
    })
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}