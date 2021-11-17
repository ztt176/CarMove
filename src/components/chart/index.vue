<!--
 * @Author: your name
 * @Date: 2020-11-11 10:55:44
 * @LastEditTime: 2021-02-04 18:23:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \aeos_dap_webui\src\components\chart\index.vue
-->
<template>
<div>
    <div :id="chartId" :style="{ width: width, height: height }"></div>
</div>
</template>

<script>
import resize from './mixins/resize'
export default {
    name: "MyChart",
    mixins: [resize],
    props: { 
        chartId: {
            type: String,
            required: true
        },
        width: {
            type: String,
            default: "500px"
        },
        height: {
            type: String,
            default: "500px"
        },
        chartOptions: {
            type: Object,
            required: true
        },
    },
    data() {
        return {
            chart: null,
        }
    },
    methods: {
        createChart() {
            // 基于准备好的dom，初始化echarts实例
            this.chart = this.$echarts.init(document.getElementById(this.chartId));
            //图表正在加载效果
            this.chart.showLoading({
                text: '正在请求数据',
                color: '#00BFFF',
                textColor: '#00BFFF',
                maskColor: 'rgba(255, 255, 255, 0.2)',
                zlevel: 0,
                spinnerRadius: 17,
                lineWidth: 2
            });

        },
        init(code, length) {
            if (code == 200) {
                this.chart.hideLoading();//隐藏正在加载效果
                if (length > 0) {
                    this.chart.setOption(this.chartOptions, true);//设置图表数据
                } else {
                    var html = '<div style="color:#868686; height:100%; font-size: 16px;text-align:center;line-height:' + this.height + ';">暂无数据</div>';
                    document.getElementById(this.chartId).innerHTML = html
                    document.getElementById(this.chartId).removeAttribute('_echarts_instance_')
                }
            } else {
                this.chart.hideLoading();
                var html = '<div style="color:#868686;height:100%; font-size: 16px;text-align:center;line-height:' + this.height + ';">数据请求失败，请稍后重试</div>';
                document.getElementById(this.chartId).innerHTML = html
                document.getElementById(this.chartId).removeAttribute('_echarts_instance_')
            }

        },
        clearChart() {
            this.chart.clear();//清空图表
            
        },
        disposeChart() {
            this.chart.dispose();//清空图表
        },
        chartGroup(){
            return this.chart;//返回图表实例，图表联动时可以使用
        },
        chartResize(){
            if(this.chart){
                this.chart.resize();
            }
        }
    }
}
</script>
