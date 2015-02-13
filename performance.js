(function(global) {
    'use strict';

    // 为了演示存在的对象，正式使用时可以删除
    global.obj4Show = [];

    // private begin
    /**
     * 时间配置部分,前端将按照配置输出时间节点
     *
     * @returns {{navigationStart: string[], redirectTime: string[], fetchTime: string[], appcacheTime: string[], unloadEventTime: string[], lookupDomainTime: string[], connectTime: string[], requestTime: string[], responseTime: string[], domInteractiveTime: string[], domReadyTime: string[], domContentLoadedTime: string[], loadEventTime: string[], loadTime: string[]}}
     */
    var _getTimeConf = function() {
        return {
            navigationStart: ['起点时间', 'navigationStart']
            , redirectTime: ['重定向时间', 'redirectEnd', 'redirectStart']
            , fetchTime: ['重定向结束，页面开始渲染时间', 'fetchStart', 'navigationStart']
            , appcacheTime: ['应用程序缓存时间', 'domainLookupStart', 'fetchStart']
            , unloadEventTime: ['前一文档的卸载时间', 'unloadEventEnd', 'unloadEventStart']
            , lookupDomainTime: ['DNS寻址时间', 'domainLookupEnd', 'domainLookupStart']
            , connectTime: ['服务器连接时间', 'connectEnd', 'connectStart']
            , requestTime: ['请求时间', 'responseStart', 'requestStart']
            , responseTime: ['响应时间', 'responseEnd', 'requestStart']
            , domInteractiveTime: ['dom树渲染完成时间，准备开始创建渲染树', 'domInteractive', 'domLoading']
            , domReadyTime: ['文档准备工作完成时间', 'domComplete', 'domInteractive']
            , domContentLoadedTime: ['domContentLoaded事件时间', 'domContentLoadedEventEnd', 'domContentLoadedEventStart']
            , loadEventTime: ['onload事件时间', 'loadEventEnd', 'loadEventStart']
            , loadTime: ['全文档执行时间', 'loadEventEnd', 'navigationStart']
        }
    };

    /**
     * 将时间格式化处理，只处理格式化为‘yyyy/MM/dd hh:mm:ss.mi’,
     * ps： 如果有DateUtils，则应该移动到DateUtils中去
     *
     * @param {Number} msDate 传入的Number类型date毫秒数
     * @returns {string} 返回的有格式的数据类型
     */
    function _dateFormat(msDate){
        try {
            var date = new Date(msDate);
            return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDay() + ' '
                + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();
        } catch(e) {
            console.log('转换时间出错');
        }
    }
    // private end

    /**
     * 此方法一般来说放置在onload事件中，可以统计页面加载各阶段的时间
     * 参数可以选择前端统计或者后端统计，默认前端统计，发送结果至后端
     *
     * @param {Boolean} type 开关值，不传入时为前端统计，传入时为后端统计
     */
    function getPerformanceTime(type) {
        // 构建事件对应的配置常量
        // 结构如下, key：需要展示的时间简称
        // valuelist: [0]:时间说明，[1]:时间统计的被减数属性名称，[2]:时间统计的减数属性名称
        var MAP_4_SHOW = _getTimeConf();

        // 如果对象不存在，则需要手动添加数据，此对象只针对ie9+, window.msPerformance
        // chrome6-9为window.webkitPerformance
        // chrome10中是window.performance
        var _performance = window.performance || window.webkitPerformance || window.msPerformance || {};
        var _timing = _performance.timing || {};

        // 如果无需配置则直接返回timing对象给后端
        if(type) return _timing;

        // 前端解析时，为后端返回的对象
        var resObj = {};
        // 根据配置打印消耗时间
        for(var key in MAP_4_SHOW) {
            var tempList = MAP_4_SHOW[key];
            var subTime = ((_timing[tempList[1]] || 0) - (_timing[tempList[2]] || 0));

            // 构造一个对象，以备后台记录和监控
            resObj[key] = subTime;

            // 处理开始时间
            if(key == 'navigationStart') {
                global.obj4Show.push(tempList[0] + _dateFormat(_timing[tempList[1]]));
                console.log(tempList[0] + _dateFormat(_timing[tempList[1]]));
                continue;
            }

            // 打印所有时间
            global.obj4Show.push(tempList[0] + ': ' + subTime + 'ms');
            console.log(tempList[0] + ': ' + subTime + 'ms')
        }

        return resObj;
    }

    // be public
    global.getPerformanceTime = getPerformanceTime;
})(window);
