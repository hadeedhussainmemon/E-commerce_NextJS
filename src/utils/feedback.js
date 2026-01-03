/**
 * Ultimate Feedback Utilities
 * Provides subtle Haptic and Sound feedback for a premium mobile/desktop experience.
 */

const sounds = {
    pop: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // Subtle click/pop
    success: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3", // Gentle chime
};

/**
 * Trigger Haptic Feedback (Vibration)
 * @param {string} type - 'light', 'medium', 'heavy'
 */
export const triggerHaptic = (type = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        switch (type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(25);
                break;
            case 'heavy':
                navigator.vibrate(50);
                break;
            default:
                navigator.vibrate(10);
        }
    }
};

/**
 * Play a UI Sound
 * @param {string} type - 'pop', 'success'
 */
export const playSound = (type = 'pop') => {
    if (typeof Audio !== 'undefined') {
        const audio = new Audio(sounds[type]);
        audio.volume = 0.2; // Keep it subtle and non-intrusive
        audio.play().catch(err => console.log('Audio blocked by browser policy'));
    }
};

/**
 * Combined high-end interaction feedback
 */
export const triggerPremiumFeedback = (soundType = 'pop', hapticType = 'light') => {
    playSound(soundType);
    triggerHaptic(hapticType);
};
