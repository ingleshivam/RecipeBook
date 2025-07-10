export default function generateMailTemplate(
  functionalityName: string,
  otp: number,
  name?: string
) {
  if (functionalityName === "login") {
    return `
            <!DOCTYPE html>

            <html>
            <head>
                <meta charset="UTF-8" />
                <title>Your OTP Code</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    padding: 20px;
                }
                .container {
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    max-width: 500px;
                    margin: auto;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                .otp-code {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2e7d32;
                    margin: 20px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #888888;
                    margin-top: 30px;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h2>Hello ${name}👋,</h2>
                <p>
                    Your One-Time Password (OTP) for login/verification is:
                </p>

                <div class="otp-code">${otp}</div>

                <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>

                <p>If you did not request this code, you can safely ignore this email.</p>

                <div class="footer">
                    &copy; 2025 Recipe Share. All rights reserved.
                </div>
                </div>
            </body>
            </html>
            `;
  }
}
