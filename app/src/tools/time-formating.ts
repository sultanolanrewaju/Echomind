const formatTimeAgo = (createdAt: string | Date): string => {
    const now = new Date();
    const past = new Date(createdAt);
    const secondsAgo = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (secondsAgo < 5) {
        return "just now";
    }
    if (secondsAgo < 60) {
        return `${secondsAgo} seconds ago`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} miniutes ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} hours ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) {
        return `${daysAgo} days ago`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 4) {
        return `${weeksAgo} weeks ago`;
    }

    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
        return `${monthsAgo} months ago`;
    }

    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo} years ago`;
}

export default formatTimeAgo