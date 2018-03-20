# command_line_application_for_gmail_attachment

It is a command line application to download attachments from gmail. It asks for some parameters like sender's email, number of emails and date. This is a part of a selenium automation script which I made to automate my internship work, but only this part is OKAY to upload because of security issues.


### Prerequisites

Make sure you have Node and NPM installed on the system.

### Installing

* [Node.js and Npm](https://docs.npmjs.com/getting-started/installing-node) - Refer this to install Node and NPM
* Now open terminal and navigate to your working directory.
* Now if you are done with the steps described above, copy the command below and paste it in teminal.

```
npm install
```

This will install all required dependencies.

### Downloading attachments

Run below command from your project directory

```
node download_attachment.js --help

```
You'll get below result.

```

Usage: download_attachment [options]

  Options:

    -V, --version            output the version number
    -f, --from <email>       Email Id of sender
    -a, --after [value]      after date YYYY/MM/DD [Default value is the date of yesterday in YYYY/MM/DD format]
    -n, --num_email [value]  num_email number of recent emails will be searched for attachment. [Default value 1]
    -h, --help               output usage information

```
Follow instructions and pass params while running applications to get desired results.

## Authors

* **Nikhil Bhandarkar** - *Initial work* - [raavan-n](https://github.com/raavan-n)
