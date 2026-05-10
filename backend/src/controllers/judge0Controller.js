import axios from 'axios';

const JUDGE0_API = 'https://ce.judge0.com/submissions/?base64_encoded=false&wait=true';

const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3
  java: 62,       // Java (OpenJDK 13)
};

export async function executeCode(req, res) {
  try {
    const { language, code } = req.body;
    const language_id = LANGUAGE_IDS[language];
    if (!language_id) {
      return res.status(400).json({ success: false, error: 'Unsupported language' });
    }

    const response = await axios.post(
      JUDGE0_API,
      {
        source_code: code,
        language_id,
        stdin: '',
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
      }
    );

    const data = response.data;
    if (data.stderr) {
      return res.json({ success: false, output: data.stdout || '', error: data.stderr });
    }
    return res.json({ success: true, output: data.stdout || 'no output' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
