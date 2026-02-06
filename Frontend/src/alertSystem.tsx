import emailjs from '@emailjs/browser';

let isAlertActive = false; 

export const checkFrostAlert = (temp: number) => {
  console.log("Checking temp:", temp.toFixed(2)); 

  // Trigger alert if temp is below 24.5°C
  if (temp < 24.5 && !isAlertActive) {
    console.log("Threshold hit! Sending alert..."); 
    sendEmail(temp);
    isAlertActive = true; 
  }

  // Reset logic when it warms up to 25°C
  if (temp > 25 && isAlertActive) {
    console.log("Temperature stabilized. Resetting alert.");
    isAlertActive = false;
  }
};

const sendEmail = (temp: number) => {
  const templateParams = {
    temp: temp.toFixed(1) // Matches {{temp}} in your EmailJS template
  };

  emailjs.send(
    'service_p1qqgop',    // Verify this ID after connecting your Gmail!
    'template_6wj82ov',   
    templateParams, 
    '1kuFdRrKBEgYtG-6C'   
  )
  .then((res) => console.log('✅ Email Sent Successfully!', res.status))
  .catch((err) => console.error('❌ Email Failed:', err));
};
