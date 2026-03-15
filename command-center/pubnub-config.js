/**
 * Bryan's Command Center - PubNub Configuration
 * Silverback AI • NorCal Carb Mobile
 *
 * Replace the placeholder keys below with your actual PubNub publish and
 * subscribe keys from https://admin.pubnub.com before going live.
 */

const PubNubConfig = {
    publishKey:  'pub-c-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    subscribeKey: 'sub-c-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    userId:      'bryan-command-center',
    channel:     'command-center'
};

/**
 * Initialize a PubNub client and subscribe to the command-center channel.
 * Incoming messages are dispatched to the Dashboard via dispatchPubNubMessage().
 *
 * The PubNub SDK must be loaded before this script (see index.html).
 *
 * @returns {object|null} The PubNub client instance, or null if the SDK is
 *                        not loaded or the keys are still placeholders.
 */
function initPubNub() {
    if (typeof PubNub === 'undefined') {
        console.warn('PubNub SDK not loaded – real-time updates disabled.');
        return null;
    }

    if (PubNubConfig.publishKey.startsWith('pub-c-xxxxxxxx') ||
        PubNubConfig.subscribeKey.startsWith('sub-c-xxxxxxxx')) {
        console.warn('PubNub keys are placeholders – real-time updates disabled. ' +
                     'Set your keys in command-center/pubnub-config.js and .vscode/settings.json.');
        return null;
    }

    const client = new PubNub({
        publishKey:  PubNubConfig.publishKey,
        subscribeKey: PubNubConfig.subscribeKey,
        userId:      PubNubConfig.userId
    });

    client.addListener({
        message({ channel, message }) {
            dispatchPubNubMessage(channel, message);
        },
        status({ category }) {
            if (category === 'PNConnectedCategory') {
                console.log('✅ PubNub connected to channel:', PubNubConfig.channel);
            }
        }
    });

    client.subscribe({ channels: [PubNubConfig.channel] });

    return client;
}

/**
 * Handle an incoming PubNub message and update the dashboard in real time.
 *
 * Expected message shape:
 *   { type: 'activity' | 'metrics' | 'task_update', payload: { ... } }
 *
 * @param {string} channel - The channel the message arrived on.
 * @param {object} message - The decoded message payload.
 */
function dispatchPubNubMessage(channel, message) {
    if (!message || !message.type) return;

    switch (message.type) {
        case 'activity':
            if (typeof Dashboard !== 'undefined' && message.payload) {
                Dashboard.addActivity(message.payload);
            }
            break;

        case 'metrics':
            if (typeof CommandCenterData !== 'undefined' && message.payload) {
                const allowed = ['systemLoad', 'agentEfficiency', 'tasksCompletedToday', 'nextBriefing'];
                allowed.forEach(key => {
                    if (Object.prototype.hasOwnProperty.call(message.payload, key)) {
                        CommandCenterData.metrics[key] = message.payload[key];
                    }
                });
                const loadEl = document.getElementById('system-load');
                const effEl  = document.getElementById('agent-efficiency');
                if (loadEl !== null) {
                    loadEl.style.width = `${CommandCenterData.metrics.systemLoad}%`;
                }
                if (effEl !== null) {
                    effEl.style.width = `${CommandCenterData.metrics.agentEfficiency}%`;
                }
            }
            break;

        case 'task_update':
            if (typeof Dashboard !== 'undefined') {
                Dashboard.renderTasks();
            }
            break;

        default:
            console.log('PubNub message received:', message);
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PubNubConfig, initPubNub, dispatchPubNubMessage };
}
