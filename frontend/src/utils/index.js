import lodash from 'lodash';

export const countTimeDiff = (time) => {
    const diffTimeInMs = Date.now() - new Date(time);
    const years = Math.floor(diffTimeInMs / (1000 * 60 * 60 * 24 * 365));
    if (years > 0) {
        return `${years > 1 ? `${years} years ago` : `${years} year ago`} `;
    }
    const months = Math.floor(diffTimeInMs / (1000 * 60 * 60 * 24 * 30));
    if (months > 0) {
        return `${
            months > 1 ? `${months} months ago` : `${months} month ago`
        } `;
    }
    const days = Math.floor(diffTimeInMs / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days > 1 ? `${days} days ago` : `${days} day ago`} `;
    }
    const hours = Math.floor(diffTimeInMs / (1000 * 60 * 60));
    if (hours > 0) {
        return `${hours > 1 ? `${hours} hours ago` : `${hours} hour ago`} `;
    }
    const minutes = Math.floor(diffTimeInMs / (1000 * 60));
    if (minutes > 0) {
        return `${
            minutes > 1 ? `${minutes} minutes ago` : `${minutes} minute ago`
        } `;
    }
    const seconds = Math.floor(diffTimeInMs / 1000);
    if (seconds > 0) {
        return `${
            seconds > 1 ? `${seconds} seconds ago` : `${seconds} second ago`
        } `;
    }
};
