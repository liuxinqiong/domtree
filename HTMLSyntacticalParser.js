function Element(tagName) {
    this.tagName = tagName
    this.attr = {}
    this.childNodes = []
}

function Text(value) {
    this.value = value || ''
}

function HTMLSyntacticalParser() {
    this.stack = []
    this.stacks = []
}
HTMLSyntacticalParser.prototype.getOutPut = function() {
    return this.stacks
}
// 一开始搞复杂了，合理利用基本数据结构真是一件很酷炫的事
HTMLSyntacticalParser.prototype.receiveInput = function(token) {
    var stack = this.stack
    if(token.type === 'startTag') {
        stack.push(new Element(token.value.substring(1)))
    } else if(token.type === 'attr') {
        var t = token.value.split('='), key = t[0], value  = t[1].replace(/'|"/g, '')
        stack[stack.length - 1].attr[key] = value
    } else if(token.type === 'text') {
        if(stack.length) {
            stack[stack.length - 1].childNodes.push(new Text(token.value))
        } else {
            this.stacks.push(new Text(token.value))
        }
    } else if(token.type === 'endTag') {
        var parsedTag = stack.pop()
        if(stack.length) {
            stack[stack.length - 1].childNodes.push(parsedTag)
        } else {
            this.stacks.push(parsedTag)
        }
    }
}