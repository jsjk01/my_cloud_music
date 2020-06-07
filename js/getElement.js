/**
 * @param {变量} selectors ：包含一个或多个要匹配的选择器的 DOM字符串DOMString。 
 *                  该字符串必须是有效的CSS选择器字符串；
 *                  如果不是，则引发SYNTAX_ERR异常。
 * @function {功能} $: 表示文档中与指定的一组CSS选择器匹配的第一个元素的html元素Element对象。
 *                  简而言之，就是返回准备操作的那一块布局
 */
function $(selectors){
    return document.querySelector(selectors)
}