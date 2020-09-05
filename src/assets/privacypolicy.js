const privacy = `## Your privacy is protected

COVID Alert is built with strong privacy protection.

It's extremely unlikely that you could be identified while using this app. The COVID Alert app takes extensive steps, described below, to ensure your privacy and data are protected.

Use of the app is voluntary.

## What the app collects and stores on your phone
- Random codes from your phone, for 14 days.
- Random codes from other phones near you, for 14 days.

The random codes are only stored and used for the purpose of notifying you, or others, of possible COVID-19 exposure.

### How the data is protected
- The app cannot connect your identity with the random codes.
- Your phone encrypts the random codes. You must give your permission before your phone will share the random codes with COVID Alert.

### COVID Alert has no way of knowing
- Your location.
- Your name or address.
- Your phone's contacts.
- Your health information.

## If you have an Android phone
- To use Bluetooth scanning, Android phones need Location setting on for all apps. While COVID Alert has no way of knowing where you are, Google may have access to your location. If you have an Android phone, you may want to use the lowest accuracy option for Location and turn off Google Location History.
- You can check the app’s permissions in your phone’s settings. You’ll see that COVID Alert does not have permission to use location services.


## What the app shares
### Nothing is done without your permission.
- Nothing is shared without your explicit permission.
- When you give permission, the only information that’s shared is the random codes from your phone.
- Only the app and its server will have access to the random codes.

### If you're diagnosed with COVID-19
- You can choose to share your random codes from the past 14 days with a central server operated by the Government of Canada.
- If you share your random codes, nobody will get any information about you or the time you were near them.
- You’ll also be asked for permission to share your random codes with the central server for 13 days after.

### If a person you were near reports a diagnosis through the app
- No information about you is shared with anyone.
- You will not receive any information about anyone else, not even someone you were in contact with who reports a diagnosis through the app.

## Deleting your data
- All random codes, whether from your phone or others, are deleted after 15 days.
- You can delete the app at any time, and the random codes on your phone will be automatically deleted after 15 days. You can also delete the Exposure Logs yourself from your phone’s settings. 
- If you uploaded your random codes before deleting the app, they will be deleted from the server after 15 days.

## Other information about you
COVID Alert is a Government of Canada app. It is designed so that your health information stays with your provincial or territorial healthcare provider. Your identity and health status will not be shared with the Government of Canada. COVID Alert does not know who you are and cannot access your health information.
- If you test positive for COVID-19, your healthcare provider will give you a one-time key. It tells COVID Alert that you can upload your random codes.
- COVID Alert trusts this key. The app uses this key so it does not have to collect any information that could identify you.
- Healthcare workers have no way to provide your personal information to COVID Alert.
- To protect the integrity of the one-time keys provided by your healthcare provider, your province may generate a long internal identification number to make sure the key was requested by a valid source. The Government of Canada is not able to associate these internal identification numbers to you or other app users, and they are only used when needed to prevent cybersecurity threats.
- If you receive an exposure notification, you will be given suggested next steps. The Government of Canada will not receive any health information about you if you take those next steps.
- COVID Alert does not connect with or collect any information from any other app on your phone.

## Your IP address
As a security measure, the server will store your IP address in system logs when the app does any of the following actions:

- Download a list of positive codes.
- Enter a one-time key.
- Upload your random codes.

Your IP address is not connected to any other information in the system, like one-time keys or random codes.

Without these security protections in place, spammers could flood the COVID Alert system and your phone with fake exposure notifications.

### How IP addresses are used and protected
- IP addresses are stored in system logs.
- System logs are kept for up to 3 months under normal conditions. If there’s an investigation into suspicious activity, we keep system logs for up to 2 years to help the investigation.
- System logs are closely protected. They can only be used for ensuring performance and responding to security threats.
- If there’s an investigation, we may need to share the relevant system logs, including IP addresses, with law enforcement, as required by law. They could use these logs to identify people who attack the system.

## Links to other websites
The app contains some links to websites that are managed by provincial and territorial governments. They may ask for or collect information about you. The COVID Alert system has no access to any information you may give to those websites.

## Questions?
Contact the COVID-19 information line:
- Phone: [1-833-784-4397](tel:1-833-784-4397)
- Teletypewriter (TTY): [1-800-465-7735](1-800-465-7735)
  (Monday to Friday, 8 a.m. to 8 p.m. Eastern time)
- Email: [hc.AlerteCOVIDAlert.sc@canada.ca](mailto:hc.AlerteCOVIDAlert.sc@canada.ca)
`;

export default privacy;
