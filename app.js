function html(element, htmlString) {
    // parseHTML
    var syntacticalParser = new HTMLSyntacticalParser()
    var lexicalParser = new HTMLLexicalParser(htmlString, syntacticalParser.receiveInput.bind(syntacticalParser))
    lexicalParser.parse()
    console.log(lexicalParser.getOutPut())
    console.log(syntacticalParser.getOutPut())
    var dom = vdomToDom(syntacticalParser.getOutPut())
    var fragment = document.createDocumentFragment()
    dom.forEach(item => {
        fragment.appendChild(item)
    })
    element.appendChild(fragment)
}

function vdomToDom(array) {
    var res = []
    for(let item of array) {
        res.push(handleDom(item))
    }
    return res
}

function handleDom(item) {
    if(item instanceof Element) {
        var element = document.createElement(item.tagName)
        for(let key in item.attr) {
            element.setAttribute(key, item.attr[key])
        }
        if(item.childNodes.length) {
            for(let i = 0; i < item.childNodes.length; i++) {
                element.appendChild(handleDom(item.childNodes[i]))
            }
        }
        return element
    } else if(item instanceof Text) {
        return document.createTextNode(item.value)
    }
}

html(document.getElementById('app'), '<p class="a" data="js">测试并列元素的</p><p class="a" data="js">测试并列元素的</p>')
html(document.getElementById('app'), '测试<div>你好呀，我测试一下没有深层元素的</div>')
html(document.getElementById('app'), '<div class="div"><p class="p">测试一下嵌套很深的<span class="span">p的子元素</span></p><span>p同级别</span></div>')