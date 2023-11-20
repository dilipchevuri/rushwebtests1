#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/express-app

#navigate into our working directory where we have all our github files
cd /home/ec2-user/express-app

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install
npm install express

# Install Mailchimp API dependencies
npm install @mailchimp/marketing

# Set up environment variables for Mailchimp API
echo "export MAILCHIMP_API_KEY=your_mailchimp_api_key" >> ~/.bashrc
echo "export MAILCHIMP_LIST_ID=your_mailchimp_list_id" >> ~/.bashrc

# Source the updated bashrc to make environment variables available
source ~/.bashrc

#start our node app in the background
node app.js > app.out.log 2> app.err.log < /dev/null & 