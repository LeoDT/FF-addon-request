in FF JetPack, content script can't request cross-domain content, but the addon script can.So we need to use

`port.emit("event", msg)`

But by this way, if there is a little more request, the content script can't get the corresponding response.

This two js is for this question.