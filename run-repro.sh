set -v
npm install bluebird@3.3.5

npm install cucumber@$1

# This one breaks all versions <= 0.9.4
./node_modules/.bin/cucumberjs --format pretty features/promise-example.feature

# This one breaks all versions <= 0.10.2
./node_modules/.bin/cucumberjs --format json features/promise-example.feature

# This one breaks all versions <= 0.10.2
./node_modules/.bin/cucumberjs --format json features/callback-example.feature

# This one breaks all versions <= 0.10.2
./node_modules/.bin/cucumberjs --format json features/exception-example.feature

# This one breaks all versions <= 0.10.2
node index.js --format json features/callback-example.feature

# This one hangs on all versions <= 0.10.2 so we run it last
node index.js --format json features/promise-example.feature