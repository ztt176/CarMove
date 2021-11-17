<!--
 * @Author: your name
 * @Date: 2021-09-10 11:14:05
 * @LastEditTime: 2021-09-22 15:11:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\components\vueslider\index.vue
-->
<template>
<div class="slider-box">
    <section data-title="Formatter" id="demo3">
        <div class="sliderInfo">
            <div style="width:55px;text-align:center;margin-right:5px" v-if="sliderVal[0]>=0">{{sliderVal[0]}}</div>
            <vue-slider ref="slider" v-bind="option" v-model="sliderVal" :dotStyle="option.dotStyle" :min="min" :max="max" :interval="interval">
            </vue-slider>
            <div style="width:55px;text-align:center;margin-left:10px;">{{sliderVal[1] || sliderVal*100+'%'}}</div>
        </div>
        <div>
        </div>
    </section>
</div>
</template>

<script>
import vueSlider from 'vue-slider-component';

export default {
    model:{
        prop:'value',
        event:'valchange'
    },
    props:{
        value:[Number,Array],
        min:Number,
        max:Number,
        interval:Number
    },
    components: {
        vueSlider
    },
    watch:{
        sliderVal(newV){
            this.$emit('valchange',newV)
        }
    },
    data() {
        return {
            sliderVal:this.value,
            option: {
                width: '90%',
                height: 10,
                dotSize: 16,
                disabled: false,
                show: true,
                useKeyboard: true,
                tooltip: 'hover',
                tooltipDir: [
                    "bottom",
                    "top"
                ],
                enableCross: false,
                railStyle: {
                    backgroundColor: '#DCDFE6',
                    height: '4px',
                    borderRadius: '2px'
                },
                dotStyle: {
                    backgroundColor: '#000',
                    boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.2), 0px 0px 2px 0px rgba(0, 0, 0, 0.1)',
                    borderRadius: '50%'
                },
                tooltipStyle: {
                    backgroundColor: '#666',
                    borderColor: '#666',
                    width: '48px',
                    textAlign: 'center',
                    borderRadius: '5px',
                    color: '#fff'
                },
                processStyle: {
                    backgroundColor: '#409EFF',
                    borderRadius: '2px'
                },
                piecewiseLabel: true,
                width: "100%",
                show: true
            },
        }
    },
    methods: {
        format(value) {
            return value === null ? 'null' : (typeof value === 'string' ? `"${value}"` : value)
        },
        // 有时候在tab 下面引用 会有个坑，滚动条不能动，这时候就需要在created 里面跑下面这个方法
        refreshSlider(val) {
            this.$nextTick(() => {
                this.$refs.slider3.refresh()
            })
        },
        // 下面 的方法都不是必须的
        setDisabled(name) {
            let obj = this.option[name]
            obj.disabled = !obj.disabled
        },
        setTooltip(name) {
            let obj = this.option[name]
            obj.tooltip = obj.tooltip === 'hover' ? 'always' : 'hover'
        },
        setValue(name, num) {
            let obj = this.option[name]
            obj.value = num
        },
        setIndex(name, num) {
            let slider = this.$refs[name]
            slider.setIndex(num)
        },
        getValue(name) {
            let slider = this.$refs[name]
            alert(slider.getValue())
        },
        getIndex(name) {
            let slider = this.$refs[name]
            alert(slider.getIndex())
        },
        dragStart() {
            this.option.speed = 0
        },
        dragEnd() {
            this.option.speed = 0.5
        },
        cb(val) {
            console.log(val)
        }
    },
}
</script>

<style>
.slider-box {
    /* width: 400px; */
    margin: 0 auto;
}

.sliderInfo {
    display: flex;
    justify-content: space-between;
}

.custom-label {
    position: absolute;
    bottom: 100%;
    left: 0;
    transform: translate(-50%, -12px);
    margin-left: 3px;
}

.custom-label::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 5px);
    width: 1px;
    height: 5px;
    background-color: #000;
}

.custom-label.active {
    color: #2980b9;
    font-weight: bold;
}

.custom-label.active::after {
    background-color: #2980b9;
    width: 2px;
}

.vue-slider-dot {
    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2), 0px 0px 2px 0px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    background-color: white;
}
</style>
