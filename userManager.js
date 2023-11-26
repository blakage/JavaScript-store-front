module.exports = {
    getUsernameFromSessionID : function (sessionId) {
        const sessionMap = app.get("sessionMap");
        if (sessionId in sessionMap) {
            return sessionMap[sessionId];
        }
        return null;
    }
}
