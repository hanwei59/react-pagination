/**
 * react-pagination 示例
 * Created by hanwei on 15/2/16.
 */
var React = require('react');
var DataGird = require('./src/grid');
var Pagination = require('./src/pagination');

var App = React.createClass({
  getInitialState : function(){
    return {
      columns:[
        {name: '', field: 'applyId', checkbox: true},
        {name: '申请单编号', field: 'applyId'},
        {name: '品牌', field: 'applyBrand'},
        {name: '状态', field: 'verify'},
        {name: '申请时间', field: 'addTime'}
      ],
      condition:{},
      data:[],
      checkedList:[]
    }
  },
  callback : function(data,pageInfo){
    this.setState({
      data:data
    });
  },
  search : function(){
    this.setState({
      condition:{
        paramType:$('#paramType').val(),
        paramValue:$('#paramValue').val()
      }
    });
  },
  render: function(){
    return (
      <div>
        <div className="row">
          <div className="span span24">
            <div className="search-form">
              <div className="trigger-content">
                <a className="btn btn-primary" href="javascript:void(0);"
                  onClick={this.search}>搜索</a>
              </div>
              <form method="post" name="searchForm" id="searchForm">
                <ul>
                  <li>
                    <select id="paramType" name="paramType">
                      <option value="applyId">申请单编号</option>
                      <option value="brandName">品牌名称</option>
                    </select>
                    <input type="text" className="input-text" id="paramValue" name="paramValue"/>
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>
        <DataGird
          data={this.state.data}
          columns={this.state.columns}
          checkedIds={this.state.checkedList}
          onAllChecked={this._handleDTAllChecked}
          onOneChecked={this._handleDTOneChecked}/>
        <Pagination
          url="./data.js"
          callback={this.callback}
          condition={this.state.condition}/>
      </div>
    );
  },
  /**
   * datatable的全选or全不选
   * @param status
   * @param ids
   * @private
   */
  _handleDTAllChecked(status, ids) {
    if(status){
      this.setState({checkedList:this.state.checkedList.concat(ids)});
    }else{
      this.setState({checkedList:[]});
    }
  },

  /**
   * 选中or取消某个datable的checkbox
   * @param status
   * @param id
   * @private
   */
  _handleDTOneChecked(status, id) {
    if(status){
      this.setState({checkedList:this.state.checkedList.concat([id])});
    }else{
      var checkedList = this.state.checkedList;
      for(var i=0,l=checkedList.length;i<l;i++){
        if(checkedList[i] == id){
          checkedList.splice(i,1);
        }
      }
      this.setState({checkedList:checkedList});
    }
  }
});

React.render(<App/>, document.body);