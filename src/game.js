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
        ]
    };

    const base = [...baseModules[prefix]];
    shuffleArray(base);

    // Return only the first `count` modules without adding numbers
    return base.slice(0, count);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
    this.load.on('complete', () => {});
}

function create() {
    const roles = ['Frontend', 'Backend', 'QA'];
    const menuContainer = this.add.container(window.innerWidth / 2, window.innerHeight / 2 - 50);
    const menuBackground = this.add.rectangle(0, 0, 300, 250, 0xffffff).setStrokeStyle(2, 0x000000);
    const menuTitle = this.add.text(0, -100, 'Select Your Role', {
        font: '24px Arial',
        fill: '#000',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    menuContainer.add([menuBackground, menuTitle]);

    roles.forEach((role, index) => {
        const roleButton = this.add.text(0, -50 + index * 50, role, {
            font: '20px Arial',
            fill: '#fff',
            backgroundColor: '#007bff',
            padding: { x: 20, y: 10 },
            borderRadius: 5
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.role = role.toLowerCase();
            menuContainer.destroy();
            this.startGame();
        });

        menuContainer.add(roleButton);
    });

    this.gameStarted = false;
}

Phaser.Scene.prototype.startGame = function () {
    this.gameStarted = true;

    this.modules = [];
    this.availableModules = {
        frontend: generateUniqueModules(50, 'frontend'),
        backend: generateUniqueModules(50, 'backend'),
        qa: generateUniqueModules(50, 'qa'),
    };

    this.player = this.add.container(100, 300);
    const head = this.add.circle(0, 0, 20, 0xffcc99);
    const leftEye = this.add.circle(-7, -5, 3, 0x000000);
    const rightEye = this.add.circle(7, -5, 3, 0x000000);
    const mouth = this.add.arc(0, 5, 8, 0, 180, false, 0xff0000);
    this.player.add([head, leftEye, rightEye, mouth]);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(40, 40);
    this.player.body.setOffset(-20, -20);

    this.coffeeCup = this.add.container(700, 300);
    const cupBody = this.add.rectangle(0, 0, 40, 60, 0x8B4513);
    const cupHandle = this.add.arc(25, 0, 20, 270, 90, false, 0x8B4513);
    const steam1 = this.add.arc(-10, -40, 10, 0, 180, false, 0xffffff);
    const steam2 = this.add.arc(10, -50, 10, 0, 180, false, 0xffffff);
    this.coffeeCup.add([cupBody, cupHandle, steam1, steam2]);
    this.physics.add.existing(this.coffeeCup);

    this.timeLeft = 20;
    this.timerText = this.add.text(window.innerWidth - 150, 10, `Time Left: ${this.timeLeft}`, {
        font: '20px Arial',
        fill: '#ff0000',
        fontStyle: 'bold'
    });

    this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
            this.timeLeft--;
            this.timerText.setText(`Time Left: ${this.timeLeft}`);
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        },
        callbackScope: this,
        loop: true
    });

    this.collectedModulesText = this.add.text(10, 10, 'Modules: 0', {
        font: '20px Arial',
        fill: '#007bff',
        fontStyle: 'bold'
    });

    this.blockers = this.physics.add.group();
    this.spawnBlocker();

    this.physics.add.overlap(this.player, this.coffeeCup, this.collectCoffee, null, this);
    this.physics.add.overlap(this.player, this.blockers, hitBlocker, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
};

Phaser.Scene.prototype.spawnBlocker = function () {
    const blockerTypes = ['Colleague', 'Facebook', 'Slack', 'Call', 'Fire Alarm', 'News', 'Email', 'Meeting', 'Zoom', 'Lunch'];
    const blockerType = blockerTypes[Phaser.Math.Between(0, blockerTypes.length - 1)];
    const blocker = this.blockers.create(
        Phaser.Math.Between(50, window.innerWidth - 50),
        Phaser.Math.Between(50, window.innerHeight - 50),
        null
    );

    blocker.setSize(40, 40);
    blocker.text = this.add.text(blocker.x, blocker.y, blockerType, {
        font: '16px Arial',
        fill: '#ffffff',
        backgroundColor: 'green',
        padding: { x: 20, y: 20 },
        borderRadius: 5
    }).setOrigin(0.5);

    this.time.addEvent({
        delay: Phaser.Math.Between(2000, 3000),
        callback: this.spawnBlocker,
        callbackScope: this
    });
};

Phaser.Scene.prototype.endGame = function () {
    this.scene.pause();
    this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Game Over!', {
        font: '30px Arial',
        fill: '#ff0000',
        fontStyle: 'bold'
    }).setOrigin(0.5);
};

Phaser.Scene.prototype.collectCoffee = function (player, coffeeCup) {
    this.coffeeCup.x = Phaser.Math.Between(50, window.innerWidth - 50);
    this.coffeeCup.y = Phaser.Math.Between(50, window.innerHeight - 50);

    if (this.role) {
        const modules = this.availableModules[this.role];
        const newModule = modules.pop();
        if (newModule) {
            this.modules.push(newModule);
            this.collectedModulesText.setText(`Modules (${this.modules.length}):\n${this.modules.join('\n')}`);
        }
    }
};

function hitBlocker(player, blocker) {
    // Ensure the game stops when the player collides with a blocker
    if (this.gameStarted) {
        this.gameStarted = false; // Stop the game
        this.scene.pause(); // Pause the scene
        this.add.text(window.innerWidth / 2, window.innerHeight / 2, 'Game Over!', {
            font: '30px Arial',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Optionally destroy the blocker to prevent further collisions
        blocker.destroy();
    }
}

function update() {
    if (!this.gameStarted) {        
        return;
    }

    this.player.body.setVelocity(0);
    const speed = 300; // Double the default speed

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
}