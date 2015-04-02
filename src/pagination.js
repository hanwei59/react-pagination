/**
 * React分页组件
 * Created by hanwei
 *
 * 用法：
 * <Pagination url='' callback={} condition={}></Pagination>
 * 可选属性：
 * size每页大小，默认10
 */
var React = require('react/addons');

var Pagination = module.exports = React.createClass({

  /**
   * 更新分页信息
   * @param pageInfo
   * @returns {{pageNo: (*|pageInfo.pageNo), pageSize: (*|pageInfo.pageSize), totalCount: (*|pageInfo.totalCount), pageTotalCount: number, currentPageCount: (*|pageInfo.pageSize)}}
   */
  updatePageInfo : function(pageInfo){
    var lastPageCount = pageInfo.totalCount % pageInfo.pageSize;//余数
    var pageTotalCount = (pageInfo.totalCount - lastPageCount) / pageInfo.pageSize;
    var currentPageCount = pageInfo.pageSize;
    if(lastPageCount > 0){
      pageTotalCount = pageTotalCount + 1;
      if(pageInfo.pageNo == pageTotalCount - 1){
        currentPageCount = lastPageCount;
      }
    }
    return {
      pageNo : pageInfo.pageNo,//当前页号
      pageSize : pageInfo.pageSize,//页数，每页纪录数
      totalCount : pageInfo.totalCount,//总纪录数
      pageTotalCount : pageTotalCount,//总页数
      currentPageCount : currentPageCount//当前页纪录数
    };
  },
  /**
   * 组件的默认属性
   * @returns {{size: number, url: null, callback: null, condition: {}}}
   */
  getDefaultProps : function(){
    return {
      size: 10,//每页大小
      url : null,//查询数据的url
      callback : null,//查询数据后的回调函数
      condition : {}//查询条件
    };
  },
  /**
   * 默认的分页信息初始化到state上
   * @returns {{pageNo: (*|pageInfo.pageNo), pageSize: (*|pageInfo.pageSize), totalCount: (*|pageInfo.totalCount), pageTotalCount: number, currentPageCount: (*|pageInfo.pageSize)}}
   */
  getInitialState : function(){
    return this.updatePageInfo({
      pageNo : 0,
      pageSize : this.props.size,
      totalCount : 0
    });
  },
  /**
   * 渲染完成后查询第一页数据
   */
  componentDidMount : function(){
    this.queryPage(0);
  },
  /**
   * 组件的属性condition变化后重新查询第一页数据
   * @param nextProps
   */
  componentWillReceiveProps : function(nextProps){
    if(this.props.condition != nextProps.condition){
      this.queryPage(0,nextProps.condition);
    }
  },
  /**
   * 根据页码和条件查询数据
   * @param pageNo
   * @param condition
   */
  queryPage: function(pageNo,condition){
    if(pageNo < 0 || (this.state.pageTotalCount > 0 && pageNo >= this.state.pageTotalCount)){
      return;
    }
    var newPageSize = parseInt(this.refs.selectPageSize.getDOMNode().value);
    if(newPageSize != this.state.pageSize){
      pageNo = 0;
    }
    condition || (condition = {});
    jQuery.ajax({
      url : this.props.url,
      type: 'GET',
      dataType: 'json',
      cache: false,
      timeout: 3000,
      data: jQuery.extend({
        iDisplayStart : pageNo * newPageSize,
        iDisplayLength : newPageSize
      },condition)
    }).done(function(json){
      if (json.result == 'ok') {
        var pageInfo = {
          pageNo:pageNo,
          pageSize:newPageSize,
          totalCount:json.data.iTotalRecords
        };
        var fullPageInfo = this.updatePageInfo(pageInfo);
        this.setState(fullPageInfo);
        this.props.callback(json.data.aaData, fullPageInfo);
      }else{
        alert(json.msg);
      }
    }.bind(this));
  },
  /**
   * 根据页码计算样式类
   * @param page
   * @param addClass
   * @returns {*}
   */
  createClassSet : function(page,addClass) {
    if(page < 0) page = 0;
    if(page >= this.state.pageTotalCount){
      page = this.state.pageTotalCount-1;
    }
    var classSet = {
      paginate_button : true,
      paginate_active : page == this.state.pageNo,
      paginate_button_disabled : page == this.state.pageNo
    };
    if(addClass){
      classSet[addClass] = true;
    }
    return React.addons.classSet(classSet);
  },
  render: function () {
    var pageRange = [];
    for(var i=this.state.pageNo-2;i<=this.state.pageNo+2;i++){
      if(i>=0 && i<=this.state.pageTotalCount-1){
        pageRange.push(i);
      }
    }
    return (
      <div className="bottom">
        <div id="dataTable_length" className="dataTables_length">
          <label>
            每页显示
            <select name="dataTable_length" size="1"
              ref="selectPageSize" defaultValue={this.state.pageSize}
              onChange={this.queryPage.bind(this,this.state.pageNo,this.props.condition)}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
            条
          </label>
        </div>
        <div className="dataTables_info">
          当前第 {this.state.pageNo*this.state.pageSize+1} - {this.state.pageNo*this.state.pageSize + this.state.currentPageCount} 条
           共计 {this.state.totalCount} 条
        </div>
        <div className="dataTables_paginate paging_full_numbers">
          <a className={this.createClassSet(0,'first')}
            onClick={this.queryPage.bind(this,0,this.props.condition)}>首页</a>
          <a className={this.createClassSet(this.state.pageNo - 1,'previous')}
            onClick={this.queryPage.bind(this,this.state.pageNo - 1,this.props.condition)}>上一页</a>
          <span>
            {pageRange.map(function(page){
              return (
                <a className={this.createClassSet(page)} key={page}
                  onClick={this.queryPage.bind(this,page,this.props.condition)}>{page+1}</a>
              );
            }.bind(this))}
          </span>
          <a className={this.createClassSet(this.state.pageNo + 1,'next')}
            onClick={this.queryPage.bind(this,this.state.pageNo + 1,this.props.condition)}>下一页</a>
          <a className={this.createClassSet(this.state.pageTotalCount-1,'last')}
            onClick={this.queryPage.bind(this,this.state.pageTotalCount-1,this.props.condition)}>尾页</a>
        </div>
      </div>
    );
  }
});