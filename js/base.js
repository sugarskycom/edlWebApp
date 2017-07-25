toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": false,
    "preventDuplicates": false,
    "positionClass": "toast-top-full-width",
    "onclick": null,
    "showDuration": "400",
    "hideDuration": "1000",
    "timeOut": "2000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
var url = {
    finance:'/Applyapi/Apply/ApplyMoney/1',
    purchase:'/Applyapi/Apply/ApplyPurchase/1',
    createorder:'/api/Order/CreateErpOrder/1',
    storage:'/Applyapi/Apply/ApplyStorage/1',
    area:'/api/Area/AreaList/#id',//
    track:'/api/Business/GetLogisticsTracktByCode/#code',//商家订单实时物流轨迹
    vorder:'/api/Business/GetOrderListByBusinessID/#bid',//商家订单列表
    vgoods:'/api/Business/GetGoodListByBusinessID/#bid_#sid',//商家商品列表
    noorder:'/html/ereach-noorder.html',
}

/*切换button的active*/
$('#select1 span').click(function () {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
});
$('#select2 span').click(function () {
    $(this).toggleClass('active');
});
//绑定1级地区
function bindArea(){
    url.area = url.area.replace('#id',0);
    $.get(url.area,'',function(ret){
        console.info(ret)
    })
} 
//提交申请金融
function applyMoney() {
    var username = $.trim($("#user").val());
    var pNumber = $.trim($("#pNumber").val());
    var time = $.trim($("#deadline").val());
    var quota = $.trim($(".active").html());
    var remark = $.trim($("#remark").val());
    /*正则检验手机号*/
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    var flag = reg.test(pNumber); //true
    /*正则校验天数*/
    var reg1 = /^[0-9]*[1-9][0-9]*$/;
    var flag1 = reg1.test(time);
    if (username == '') {
        toastr.error('请输入联系人！');
        return false;
    }else if(username.length < 2){
        toastr.error('姓名至少两个字！');
        return false;
    }
    else if (pNumber == '') {
        toastr.error('请输入手机号！');
        return false;
    } else if (!flag) {
        toastr.error('请输入正确的手机号！');
        return false;
    } else if (time == '') {
        toastr.error('请输入使用天数！');
        return false;
    }
    else if (!flag1) {
        toastr.error('请输入正确的使用天数！');
        return false;
    } else {
        /*AJAX提交数据*/
        var data = {
            Name: username,
            mobile: pNumber,
            MoneyLimit: quota,
            UseYear: time,
            Remark: remark,
        };
        $.post(url.finance,data,function(ret){
            if(ret.Status){
                toastr.success('您的融资申请提交成功，我们将稍后联系您。');
                setTimeout(function(){
                    window.location.reload();
                },700)
            }
            else{
                toastr.error('系统出错，请稍后再试');
            }
        })
    }
}

function applyStorage(){
    var username = $.trim($("#username").val());
    var pNumber = $.trim($("#pNumber").val());
    var ProviceName = $.trim($("select").val());
    var Proportion = $.trim($("#size").val());
    var quota = document.getElementsByClassName('active');
    var newQuota = [];
    var BeginTime = $("#start").val();
    var EndTime = $("#end").val();
    //货物类型
    $.each($("#select2 span.active"),function(){
        newQuota.push($.trim($(this).text()));
    });
    newQuota = newQuota.join(',');
    /*var time = */
    /*正则检验手机号*/
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    var flag = reg.test(pNumber); //true
    /*正则校验平米数*/
    var reg1 = /^[0-9]*[1-9][0-9]*$/;
    var flag1 = reg1.test(Proportion);
    var time1 = $('#start').val();
    var time2 = $('#end').val();
    var time = moment(time2).format('X')-moment(time1).format('X');
    var totalPrice = Proportion * (time+1) * 1;

    if (Proportion == '') {
        toastr.error('请输入需求面积!');
        return false;
    }
    else if (!flag1) {
        toastr.error('需求面积要求整数坪!');
        return false;
    }
    else if (time1 == '' || time2 == '') {
        toastr.error('请输入使用天数!');
        return false;
    }
    else if(!time){
        toastr.error('起始时间要小于结束时间!');
        return false;
    }
    else if (username == '') {
        toastr.error('请输入联系人!');
        return false;
    }
    else if (pNumber == '') {
        toastr.error('请输入手机号!');
        return false;
    }
    else if (!flag) {
        toastr.error('请输入正确的手机号!');
        return false;
    }
    else {
        /*AJAX提交数据*/
        var data = {
            ProviceName: ProviceName,
            Proportion: Proportion,
            GoodsType: newQuota,
            totalPrice: totalPrice,
            Name: username,
            mobile: pNumber,
            BeginTime:BeginTime,
            EndTime:EndTime,
        };
        $.post(url.storage,data,function(ret){
            if(ret.Status){
                toastr.success('您的租仓需求已提交成功！我们的商务人员将稍后联系您。');
                setTimeout(function(){
                    window.location.reload();
                },600);
            }
            else{
                toastr.error('系统出错，请稍后再试');
            }
        });
    }
}

//发布采购单
function sendPurchase(){
    var username = $.trim($("#user").val());
    var pNumber = $.trim($("#pNumber").val());
    var product = $.trim($("#product").val());
    var remark = $.trim($("#remark").val());
    /*正则检验手机号*/
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    var flag = reg.test(pNumber); //true
    if (product == '') {
        toastr.error('请输入要采购的产品!');
        return false;
    }
    else if (username == '') {
        toastr.error('请输入联系人!');
        return false;
    }else if(username.length < 2){
        toastr.error('姓名至少两个字！');
        return false;
    }
    else if (pNumber == '') {
        toastr.error('请输入手机号！');
        return false;
    } else if (!flag) {
        toastr.error('请输入正确的手机号！');
        return false;
    } else {
        /*AJAX提交数据*/
        var data = {
            Name: username,
            mobile: pNumber,
            PurchaseName: product,
            Remark: remark,
        };
        $.post(url.purchase,data,function(ret){
            if(ret.Status){
                toastr.success('采购单已提交，工作人员会尽快与您取得联系！');
                setTimeout(function(){
                    window.location.reload();
                },700)
            }
            else{
                toastr.error('系统出错，请稍后再试');
            }
        });
    }
}
/*计算两个日期的时间差（相差天数）*/
function DateDiff(sDate1, sDate2) {
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    if((oDate1 - oDate2)<0){
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
        return iDays;
    }else{
        return false;
    }
}
//得到URL参数
function getUrlParam(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//查询运单信息
function searchTrack(){
    var obj = {
        lCode:$.trim($("#code").val()),
    };
    if(obj.lCode==''){
        toastr.error('运单号不能为空!');
        return false;
    }
    else{
        $.get(url.track,obj,function(ret){
            var html = '<p class="waybill-num">运单号 : <span>'+obj.lCode+'</span></p>';
            html += '<div class="waybill-detail">';
            if(ret.Status){
                $.each(ret.Data,function(i){
                    var remark = this.Remark==''?'':'('+this.Remark+')';
                    html += '<div class="waybill-process">';
                    if(i==0){
                        html += '<p><span class="circle active"></span>'+this.AcceptStation+remark+'</p>';
                    }
                    else{
                        html += '<p><span class="circle"></span>'+this.AcceptStation+remark+'</p>';
                    }
                    html += '<p class="process-time">'+this.AcceptTime+'</p>';
                    html += '</div>'
                })
            }
            else{
                toastr.error('未找到运单信息或系统错误');
            }
            html += '</div>';
            $("#searchResult").html(html);
        });
    }
}

function loadOrder(){
    //console.info(getUrlParam("bid"));
    var bid = getUrlParam("bid");
    //if(bid == null || typeof bid == undefined || bid=='') window.location.href=url.noorder;
    var geturl = url.vorder;
    geturl = geturl.replace('#bid',bid);
    $.get(geturl,'',function(ret){
        if(ret.Status){
            if(ret.Data.length==0){
                //window.location.href=url.noorder;
            }
            else{
                var html = '';
                $.each(ret.Data,function(){
                    html += '<div class="e-check-order">';
                    html += '<div class="order-title"><span>订单号 ：<b>'+this.OrdersCode+'</b></span><span>'+this.Status+'</span></div>';
                    html += '<div class="order-list">';
                    var j = 0;
                    var total = 0;
                    $.each(this.Products,function(){
                        j++;
                        total += this.Num;
                        html += '<div class="order-item"><span>'+this.ProductName+'</span><span class="item-num"> <b>'+this.Num+'</b> 件</span></div>';
                    })
                    if(j>2) html += '<p class="check-all">查看全部</p>';
                    html += '</div>';
                    html += '<div class="order-footer"><span class="list-num">共 <b>'+total+'</b> 件物品</span><button type="button" onclick="getTrack('+this.Express_Code+')">查看物流</button></div>';
                    html += '</div>';
                });
                $("#orderList").html(html);
            }
        }
        else{
            toastr.error('系统出错');
        }
    })

}
function getTrack(code){
    if(typeof code == 'undefined' || code=='') {
        return false;
    }
    BootstrapDialog.show({
        type:BootstrapDialog.TYPE_PRIMARY,
        title:'运单号：'+code,
        message:function(){
            var obj = $('<div class="waybill-detail"></div>');
            $.get(url.track,{lCode:code},function(ret){
                if(ret.Status){
                    $.each(ret.Data,function(i){
                        var remark = this.Remark==''?'':'('+this.Remark+')';
                        var html='';
                        if(i==0){
                            html = '<div class="waybill-process"><p><span class="circle active"></span>'+this.AcceptStation+remark+'</p><p>'+this.AcceptTime+'</p></div>';
                        }
                        else{
                            html = '<div class="waybill-process"><p><span class="circle active"></span>'+this.AcceptStation+remark+'</p><p>'+this.AcceptTime+'</p></div>';
                        }
                        obj.append(html);
                    })
                }
            });
            return obj;
        }
    })
}
function closeDialog()
{
    $.each(BootstrapDialog.dialogs, function(id, dialog){
            dialog.close();
    });
}

function isMobile(str){
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    return reg.test(str); //true
}