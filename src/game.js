function generateUniqueModules(count, prefix) {
    const baseModules = {
        frontend: [
            'npm', 'node', 'react', 'angular', 'vue', 'webpack', 'babel', 'typescript', 'eslint', 'prettier',
            'sass', 'less', 'tailwind', 'bootstrap', 'jquery', 'vite', 'rollup', 'parcel', 'storybook', 'nextjs',
            'nuxtjs', 'svelte', 'solidjs', 'lit', 'astro', 'emotion', 'styled-components', 'redux', 'mobx', 'zustand'
        ],
        backend: [
            'express', 'mongodb', 'docker', 'graphql', 'nestjs', 'koa', 'hapi', 'fastify', 'sequelize', 'typeorm',
            'prisma', 'redis', 'rabbitmq', 'kafka', 'grpc', 'socket.io', 'passport', 'jwt', 'bcrypt', 'multer',
            'nodemailer', 'swagger', 'openapi', 'aws-sdk', 'azure-sdk', 'gcp-sdk', 'firebase', 'supabase', 's3', 'lambda'
        ],
        qa: [
            'selenium', 'junit', 'cypress', 'postman', 'pytest', 'mocha', 'chai', 'jest', 'karma', 'protractor',
            'testng', 'allure', 'gatling', 'locust', 'jmeter', 'soapui', 'rest-assured', 'webdriverio', 'playwright',
            'puppeteer', 'robot-framework', 'cucumber', 'specflow', 'testcafe', 'nightwatch', 'appium', 'xctest',
            'espresso', 'detox', 'katalon', 'zephyr'
        ],
        tester: [
            'testRail', 'jira', 'bugzilla', 'qTest', 'quality-center', 'testlink', 'tfs', 'alm', 'spiraTest',
            'practitest', 'xray', 'polarion', 'qmetry', 'testpad', 'testlodge', 'testmo', 'testuff', 'testcollab',
            'testcase-lab', 'testgear', 'testio', 'testfairy', 'honeycomb', 'raygun', 'sentry', 'rollbar', 'bugherd',
            'mabl', 'rainforest', 'ghost-inspector', 'browserstack', 'saucelabs'
        ]
    };

    const modules = [];
    const base = baseModules[prefix];

    // Add base modules first
    while (modules.length < count) {
        const module = base[modules.length % base.length] + `_${Math.floor(modules.length / base.length) + 1}`;
        modules.push(module);
    }

    return modules;
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#dddddd',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

function preload() {
    console.log('Preload function started.');
    // this.load.html('roleForm', 'src/roleForm.html'); // Commented out for now
    this.load.on('complete', () => {
        console.log('All assets loaded.');
    });
}

function create() {
    console.log('Create function started.');
    // Role selection
    this.role = 'frontend'; // Default role set to 'frontend'
    this.modules = [];
    this.availableModules = {
        frontend: generateUniqueModules(50, 'frontend'),
        backend: generateUniqueModules(50, 'backend'),
        qa: generateUniqueModules(50, 'qa'),
        tester: generateUniqueModules(50, 'tester')
    };

    console.log('Available modules initialized.');

    // Add player (human figure)
    this.player = this.add.container(100, 300); // Container for the player
    const body = this.add.rectangle(0, 0, 20, 40, 0x0000ff); // Body
    const leftArm = this.add.rectangle(-15, 0, 10, 30, 0x0000ff); // Left arm
    const rightArm = this.add.rectangle(15, 0, 10, 30, 0x0000ff); // Right arm
    const leftLeg = this.add.rectangle(-7, 30, 10, 30, 0x0000ff); // Left leg
    const rightLeg = this.add.rectangle(7, 30, 10, 30, 0x0000ff); // Right leg
    this.player.add([body, leftArm, rightArm, leftLeg, rightLeg]); // Add parts to the container
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(20, 40); // Ensure the physics body size matches the player
    this.player.body.setOffset(-10, -20); // Adjust the offset to align with the container

    console.log('Player initialized.');

    // Add coffee machine
    this.coffeeMachine = this.add.container(700, 300); // Container for the coffee machine
    const base = this.add.rectangle(0, 0, 40, 60, 0x8B4513); // Base (brown color)
    const dispenser = this.add.rectangle(0, -35, 20, 10, 0x000000); // Dispenser (black color)
    this.coffeeMachine.add([base, dispenser]); // Add parts to the container
    this.physics.add.existing(this.coffeeMachine);

    console.log('Coffee machine initialized.');
    console.log('Player and coffee machine initialized.'); // Debug: Log after player and coffee machine are initialized

    // Add keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    console.log('Keyboard controls initialized.'); // Debug: Log after keyboard controls are initialized

    // Add overlap logic
    this.physics.add.overlap(this.player, this.coffeeMachine, collectCoffee, null, this);
    console.log('Overlap logic initialized.'); // Debug: Log after overlap logic is initialized

    console.log('Create function completed.'); // Debug: Log when create function completes
}

function update() {
    console.log('Update function running.'); // Debug: Log each frame update

    if (!this.player || !this.player.body) {
        console.warn('Player or player body is not defined.'); // Debug: Warn if player is not defined
        return;
    }

    this.player.body.setVelocity(0);
    const speed = 150; // Default speed

    if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(speed);
    }

    console.log(`Player position: (${this.player.x}, ${this.player.y})`); // Debug: Log player position
}

function collectCoffee(player, coffeeMachine) {
    console.log('Coffee machine reached!');
    // Move coffee machine to a new random location
    this.coffeeMachine.x = Phaser.Math.Between(50, window.innerWidth - 50);
    this.coffeeMachine.y = Phaser.Math.Between(50, window.innerHeight - 50);

    // Add a module to the collected list
    if (this.role) {
        const modules = this.availableModules[this.role];
        const newModule = modules.pop(); // Get a unique module
        if (newModule) {
            this.modules.push(newModule);
            console.log(`Collected Modules: ${this.modules.join(', ')}`);
        }
    }
}