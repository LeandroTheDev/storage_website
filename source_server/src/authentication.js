const sessions = {};

class DriveAuthentication {
    async login(req, res) {
        const database = require('./database');
        const {
            stringsTreatment            
        } = require('./utils');

        //Getting data
        const username = req.body.username;
        const password = req.body.password;

        console.log("[Drive Auth] " + req.ip + " is authenticating in: " + username);

        //Validations
        if (stringsTreatment(typeof username, res, "Invalid Username, use a valid username to login.", 400)) { return; }
        if (stringsTreatment(typeof password, res, "Invalid Password, use a valid password to login.", 400)) { return; }
        if (stringsTreatment(typeof userPublickey, res, "Invalid Password, use a valid password to login.", 400)) { return; }

        //Credentials for login
        let credentialsPass = await database.login(username, password);
        if (credentialsPass == null) {
            res.status(500).send({ "message": "Internal Error" });
            return;
        };

        // Check if credentials is correct
        if (credentialsPass) {
            console.log("[Drive Auth] user " + username + " authenticated in ip: " + req.ip);

            let randomPassword = "";
            // Generating the Random Password
            for (let i = 0; i < 20; i++) {
                randomPassword += Math.floor(Math.random() * 10);
            }

            sessions[randomPassword] = {
                "expiration": 36000,
                "account": username
            }

            // Success, send the token to the user
            res.status(200).send({
                error: false,
                message: {
                    "session": randomPassword
                }
            });
        }
        //Wrong Credentials
        else {
            console.log("[Drive Auth] " + req.ip + " authentication refused, wrong credentials for " + username);
            res.status(401).send({ error: true, message: 'Invalid Credentials' });
            return;
        }
    }

    instanciateAuthentication(http) {
        //Post
        http.post('/drive/login', this.login);
    }
}

module.exports = new DriveAuthentication;