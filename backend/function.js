import axios from "axios";

const DEVINSIGHT_URL = import.meta.env.DEVINSIGHT_URL;

//For FrontEnd
async function sendToDevInsight({ error }) {
  try {
    await axios.post(`${DEVINSIGHT_URL}/api/logs`, {
      origin: window.location.href,
      message: error.message,
      meta: {
        stack: error.stack,
      },
    });
  } catch (err) {
    console.error("Failed to send log to DevInsight", err);
  }
}

async function sendToDevInsight({ error }) {
  try {
    await axios.post(`${DEVINSIGHT_URL}/api/logs`, {
      route: "", // Add you route inside ""
      message: error.message,
      meta: {
        stack: error.stack,
      },
    });
  } catch (err) {
    console.error("Failed to send log to DevInsight", err);
  }
}

export default sendToDevInsight;

//For BackEnd
