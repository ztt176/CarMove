<!--
 * @Author: your name
 * @Date: 2021-09-01 15:49:04
 * @LastEditTime: 2021-10-11 15:07:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \MoveDapWebUi\src\views\case\index.vue
-->
<template>
<el-container>
    <el-aside width="200px" class="casesider">
        <logo :collapse="true" />
        <el-menu class="selfmenu" :default-active="activeIndex" mode="horizontal" @select="menuSelect" text-color="#fff" active-text-color="rgb(24, 144, 255)" background-color="rgb(48, 65, 86,0)">
            <el-menu-item v-for="item in columnList" :index="item.id.toString()" :key="item.id">
                <span slot="title">{{item.subjectName}}</span>
                <el-dropdown style="float:right">
                    <span class="el-dropdown-link" style="color:#fff">
                        <i class="el-icon-more el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-button type="text" style="width:100%" @click="updatesubject = true">修改</el-button>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" style="width:100%" @click="deleteColumn(item)">删除</el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dialog title="修改栏目" :visible.sync="updatesubject" width="30%" append-to-body>
                    <el-input v-model="subjectName" placeholder="请输入栏目名称"></el-input>
                    <div slot="footer">
                        <el-button @click="updatesubject = false">取 消</el-button>
                        <el-button type="primary" @click="updateColumn(item.id)">确 定</el-button>
                    </div>
                </el-dialog>
            </el-menu-item>
        </el-menu>
        <div class="addcolumn">
            <el-popover placement="top" title="添加栏目" width="200" trigger="click" v-model="addcolumn">
                <div>
                    <el-input v-model="subjectName" placeholder="请输入栏目名称"></el-input>

                </div>
                <div style="text-align: right; margin-top:10px">
                    <el-button size="mini" type="text" @click="addcolumn = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="handelAddcol">确定</el-button>
                </div>
                <el-button type="primary" slot="reference" icon="el-icon-plus" style="width:100%">新建栏目</el-button>
            </el-popover>
        </div>
    </el-aside>
    <el-container class="casecontainer">
        <el-header class="caseheader">
            <el-button type="text" style="line-height:45px;color:#fff;font-size:16px" @click="$router.push('/index')"><i class="el-icon-arrow-left"> </i>返回首页</el-button>
            <!-- <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar">
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item @click.native="setting = true">
                        <span>布局设置</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown> -->
        </el-header>
        <el-main class="casemain">
            <div v-if="addcase">
                <el-row :gutter="10">
                    <el-col :span="16" :offset="4">
                        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                            <el-form-item>
                                <div>
                                    <el-button type="primary" @click="handelSave(false)" v-if="form.subjectId">确认</el-button>
                                    <el-button type="primary" @click="handelSave" v-if="!form.subjectId">保存</el-button>
                                    <el-button @click="handelPreviewCase">预览</el-button>
                                    <el-button @click="handelPublish" v-if="!form.subjectId">发布</el-button>
                                    <el-button @click="addcase=false">取消</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item prop="title">
                                <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                            </el-form-item>
                            <el-form-item prop="content">
                                <editor v-model="form.content" aria-placeholder="请输入正文" :min-height="height" />
                            </el-form-item>
                            <el-form-item label="封面" prop="fileList">
                                <el-upload :action="fieldAction" :headers="requestHeader" list-type="picture-card" :on-success="reportSucess" :on-remove="handleRemove" :on-change="handelUploadChange" :file-list="fileList" :limit="1">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
            <div v-else>
                <div class="mainTop">
                    <el-button type="primary" icon="el-icon-plus" @click="addcase = true;form = {};fileList=[]"> 新增</el-button>
                    <span style="margin-left:20px">共{{countData.sums}}篇，</span><span>{{countData.published}}篇已发布，</span><span>{{countData.drafts}}篇草稿</span>
                    <div style="float:right">
                        <el-button :type="gridOpen?'primary':''" icon="el-icon-s-grid" @click="handelGrid"></el-button>
                        <el-button :type="gridOpen?'':'primary'" icon="el-icon-s-unfold" @click="handelList"></el-button>
                    </div>
                </div>
                <el-row :gutter="20" v-if="gridOpen">
                    <el-col :span="6" v-for="(item,index) in caseList" :key="index" style="margin-bottom:10px">
                        <div class="caseitem">
                            <div class="casetop">
                                <img class="caseImg" :src="item.cover" style="height:215px;width:100%" alt="" @click="previewCase(item.id)">
                                <div class="caseitemmore">
                                    <el-dropdown>
                                        <span class="el-dropdown-link" style="color:#fff">
                                            <el-button type="text" icon="el-icon-more-outline"></el-button>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item>
                                                <el-button type="text" style="width:100%" @click="handelUpdateTitle(item)">重命名</el-button>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-button type="text" style="width:100%" @click="updateStauts(item)">修改状态</el-button>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-button type="text" style="width:100%" @click="handelCopy(item)">复制</el-button>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-button type="text" style="width:100%" @click="handelEdit(item)">编辑</el-button>
                                            </el-dropdown-item>
                                            <el-dropdown-item>
                                                <el-button type="text" style="width:100%" @click="deleteCase(item)">删除</el-button>
                                            </el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </div>
                            <div style="padding:10px 5px">
                                <el-tooltip effect="dark" :content="item.title" placement="top">
                                    <span class="nowarp">{{item.title}}</span>
                                </el-tooltip>
                            </div>
                            <div style="font-size:12px"><span><i class="el-icon-image-eye"></i>{{item.consult}}</span> <span><i class="el-icon-image-fabulous"></i> {{item.thumb||'0'}}</span></div>
                            <div style="overflow:hidden;padding:7px 5px"><span style="font-size:12px;color:#ccc;line-height:250%">{{item.updateTime}}更新</span>
                                <div style="float:right;">
                                    <el-tag :type="item.status==0?'info':'success'">{{item.status==0?'草稿':'已发布'}}</el-tag>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-table :data="caseList" style="width: 100%" v-if="!gridOpen">
                    <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="createBy" label="发布人" align="center">
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="updateTime" label="更新时间" align="center">
                    </el-table-column>
                    <el-table-column prop="consult" label="阅读数" align="center">
                    </el-table-column>
                    <el-table-column prop="thumb" label="点赞数" align="center">
                    </el-table-column>
                    <el-table-column prop="status" label="状态" align="center">
                        <template slot-scope="scope">
                            <div>
                                <el-tag :type="scope.row.status==0?'info':'success'">{{scope.row.status==0?'草稿':'已发布'}}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="250">
                        <template slot-scope="scope">
                            <div>
                                <el-button type="text" @click="handelUpdateTitle(scope.row)">重命名</el-button>
                                <el-button type="text" @click="updateStauts(scope.row)">修改状态</el-button>
                                <el-button type="text" @click="handelCopy(scope.row)">复制</el-button>
                                <el-button type="text" @click="handelEdit(scope.row)">编辑</el-button>
                                <el-button type="text" @click="deleteCase(scope.row)">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog title="查看案例" :visible.sync="caseVisible" append-to-body>
                <div>
                    <h3 style="text-align:center">{{caseContent.title}}</h3>
                    <div v-html="caseContent.content" class="cont"></div>
                </div>
                <div slot="footer">
                    <el-button @click="caseVisible = false">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog title="重命名" :visible.sync="titleOpen" width="30%" append-to-body>
                <div>
                    <el-input v-model="newTitle" placeholder="请输入标题"></el-input>
                </div>
                <div slot="footer">
                    <el-button @click="titleOpen = false">取 消</el-button>
                    <el-button type="primary" @click="submitTitle">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import Editor from "@/components/Editor/index";
import Logo from "../../layout/components/Sidebar/Logo";
import '@/assets/styles/icon.css';
import {
    listColumn,
    addColumn,
    updateSubject,
    deleteSubject,
    listCase,
    publishCase,
    saveCase,
    savePubCase,
    caseInfo,
    updateCase,
    caseCount,
    deleteCase
} from '@/api/case/case'
const baseUrl = process.env.VUE_APP_BASE_API;
export default {
    components: {
        Logo,
        Editor
    },
    data() {
        return {
            activeIndex: '1',
            addcolumn: false,
            updatesubject: false,
            addcase: false,
            form: {},
            height: 300,
            disabled: false,
            subjectName: '',
            columnList: [],
            fieldAction: baseUrl + '/common/upload',
            requestHeader: {},
            caseList: [],
            caseVisible: false,
            caseContent: {},
            gridOpen: true,
            titleOpen: false,
            newTitle: '',
            fileList: [],
            countData: {},
            rules: {
                content: [{
                    required: true,
                    message: '请填写事件名称',
                    trigger: 'blur'
                }],
                // fileList: [{
                //     required: true,
                //     message: '请上传图片',
                //     trigger: 'change'
                // }],
                name: [{
                    required: true,
                    message: '请填写事件名称',
                    trigger: 'blur'
                }]
            }
        }
    },
    computed: {
        ...mapGetters([
            'avatar',
        ]),
        setting: {
            get() {
                return this.$store.state.settings.showSettings
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'showSettings',
                    value: val
                })
            }
        },
    },
    created() {
        this.getColList();
        this.requestHeader['Authorization'] = 'Bearer ' + this.$cookies.get('Admin-Token');
    },
    methods: {
        //获取栏目数据
        getColList() {
            listColumn().then(res => {
                this.columnList = res.rows
                this.getCaseList()
            })
        },
        //获取案例统计数据
        getCount(params) {
            caseCount(params).then(res => {
                this.countData = res.obj
            })
        },
        //获取案例数据
        getCaseList() {
            let params = {
                subjectId: this.activeIndex
            }
            listCase(params).then((res) => {
                this.caseList = res.rows;
                this.total = res.total
            })
            this.getCount(params)
        },
        async logout() {
            this.$confirm('确定注销并退出系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                    location.href = '/index';
                })
            })
        },
        //编辑按钮
        menuSelect(index) {
            this.activeIndex = index.toString();
            this.getCaseList()
        },
        //删除图片
        handleRemove(file, fileList) {
            this.form.cover = ''
            let load = document.querySelector('.el-upload.el-upload--picture-card')
            load.style.display = 'block'
            this.fileList = [];
        },
        //上传图片发生变化
        handelUploadChange(file) {
            this.fileList[0] = {
                url: file.url
            }
            let load = document.querySelector('.el-upload.el-upload--picture-card')
            if (this.fileList.length > 0) {
                load.style.display = 'none'
            }
        },
        //图片上传成功回调
        reportSucess(response, file, fileList) {
            this.form.cover = response.url
        },
        //新增栏目
        handelAddcol() {
            addColumn({
                subjectName: this.subjectName
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '新增成功'
                })
                this.subjectName = ''
                this.getColList()
            })
        },
        //修改栏目
        updateColumn(id) {
            updateSubject({
                subjectName: this.subjectName,
                id: id
            }).then(res => {
                this.$message({
                    type: 'success',
                    message: '修改成功'
                })
                this.subjectName = ''
                this.getColList()
                this.updatesubject = false;
            })
        },
        //删除栏目
        deleteColumn(item) {
            this.$confirm('是否确认删除名称为"' + item.subjectName + '"的案例?', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(function () {
                return deleteSubject(item.id);
            }).then(() => {
                this.getColList();
                this.msgSuccess("删除成功");
            })
        },
        //保存案例
        handelSave(isCopy) {
            if (isCopy) {
                saveCase(this.form).then(res => {
                    this.msgSuccess("复制成功");
                    this.getCaseList()
                })
            } else {
                if (this.form.subjectId) {
                    updateCase(this.form).then(() => {
                        this.msgSuccess("修改成功");
                        this.getCaseList();
                        this.addcase = false;
                    })
                } else {
                    this.form.subjectId = this.activeIndex;
                    this.$refs["form"].validate(valid => {
                        if (valid) {
                            saveCase(this.form).then(res => {
                                this.msgSuccess("保存成功");
                                this.addcase = false;
                                this.getCaseList()
                            })
                        }
                    })
                }
            }
        },
        //预览案例
        handelPreviewCase() {
            this.caseVisible = true;
            this.caseContent = this.form
        },
        //发布案例
        handelPublish() {
            if (this.form.subjectId) {
                this.form.status = 1
                updateCase(this.form).then(() => {
                    this.msgSuccess("修改成功");
                    this.addcase = false;
                    this.getCaseList();
                })
            } else {
                this.form.subjectId = this.activeIndex
                publishCase(this.form).then(res => {
                    this.msgSuccess("发布成功");
                    this.addcase = false;
                    this.getCaseList()
                })
            }
        },
        //查看案例
        previewCase(id) {
            caseInfo(id).then(res => {
                if (res.data) {
                    this.caseVisible = true
                    this.caseContent = res.data;
                    // this.getCaseList()
                }
            })
        },
        //宫格视图
        handelGrid() {
            if (!this.gridOpen) {
                this.gridOpen = true;
            }
        },
        //表格视图
        handelList() {
            if (this.gridOpen) {
                this.gridOpen = false;

            }
        },
        //修改状态
        updateStauts(row) {
            let label = row.status == 0 ? '发布' : '未发布'
            this.$confirm('确定此案例状态修改为' + label + '吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.status = row.status == 1 ? 0 : 1
                updateCase(row).then(() => {
                    this.msgSuccess("修改成功");
                    this.getCaseList()
                })
            })
        },
        //复制
        handelCopy(row) {
            this.form = {
                title: row.title + '-副本',
                subjectId: row.subjectId,
                content: row.content,
                cover: row.cover
            }
            this.handelSave(true)
            // this.msgSuccess("复制成功");
            this.getCaseList()
        },
        //编辑按钮
        handelEdit(row) {
            this.form = row;
            this.addcase = true;
            this.fileList[0] = {
                url: row.cover
            }
            this.$nextTick(() => {
                let load = document.querySelector('.el-upload.el-upload--picture-card')
                if (this.fileList.length > 0) {
                    load.style.display = 'none'
                }
            })

        },
        //删除案例按钮
        deleteCase(row) {
            this.$confirm('确定此案例删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteCase(row.id).then(() => {
                    this.msgSuccess("删除成功");
                    this.getCaseList()
                })
            })

        },
        //重命名
        handelUpdateTitle(row) {
            this.titleOpen = true;
            this.newTitle = row.title
            this.form = row;
        },
        submitTitle() {
            this.$confirm('确定此案例标题修改为' + this.newTitle + '吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form.title = this.newTitle;
                updateCase(this.form).then(() => {
                    this.msgSuccess("修改成功");
                    this.getCaseList()
                    this.form = {}
                    this.titleOpen = false
                })
            })
        }

    }
}
</script>

<style lang="scss">
.casesider {
    background-color: rgba(68, 68, 68, 0.9);
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    -webkit-box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
    padding: 0;

    .addcolumn {
        position: absolute;
        bottom: 10px;
        width: 100%;
        padding: 0 24px;
    }

    .selfmenu {
        border-bottom: none;

        .el-menu-item {
            width: 100%;
            padding: 0 10px 0 40px;
            border-bottom: none !important;
            // text-align: l;
        }

        .el-menu-item:hover {
            background-color: rgb(38, 52, 69) !important;
        }

        .el-menu--horizontal>.el-menu-item.is-active,
        .el-menu--horizontal>.el-menu-item {
            border-bottom: none !important;
        }
    }
}

.caseheader {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    margin-left: 200px;
    background-color: rgba(68, 68, 68, 0.9);
    .el-icon-arrow-left {
        color: #fff;
        font-size: 16px;
        font-weight: 700;
    }
}

.casemain {
    margin-left: 200px;
    height: calc(100vh-50px);

    .mainTop {
        padding: 15px 10px;

        .el-icon-s-unfold,
        .el-icon-s-grid {
            font-size: 16px;
        }
    }

    .caseitem {
        width: 100%;
        padding: 3px;
        border: 1px solid #ddd;
        -webkit-box-shadow: 1px 0 2px rgba(0, 21, 41, .35);
        box-shadow: 1px 0 2px rgba(0, 21, 41, .35);
        border-radius: 5px;

        .nowarp {
            width: 100%;
            display: inline-block;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }

        .casetop {
            position: relative;
            cursor: pointer;

            .caseitemmore {
                position: absolute;
                top: 10px;
                right: 10px;
                display: none;

                .el-button {
                    width: 100%;
                    background: #fff;
                    border-radius: 50%;
                    -webkit-box-shadow: 1px 0 2px rgba(0, 21, 41, .35);
                    box-shadow: 1px 0 2px rgba(0, 21, 41, .35);
                    padding: 9px 9px;

                    .el-icon-position,
                    .el-icon-more-outline {
                        color: #333;
                        font-size: 18px;
                        font-weight: 800;
                    }
                }
            }
        }

        .casetop:hover .caseitemmore {
            display: block;
        }

    }

}

.cont img {
    width: 100%;
    height: auto;
}
</style>
