module.exports = {
    getUsernameFromSessionID: function (sessionId, sessionMap) {
        if (sessionMap && sessionId in sessionMap) {
            return sessionMap[sessionId];
        }
        return null;
    }
};
