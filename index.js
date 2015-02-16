/**
 * react-pagination 示例
 * Created by hanwei on 15/2/16.
 */
var React = require('react');
var Pagination = require('./pagination');

var App = React.createClass({
  getInitialState : function(){
    return {
      condition:{},
      data:[]
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
        <div className="row">
          <table className="table table-bordered table-striped dataTable">
            <thead>
              <tr>
                <th>申请单编号</th>
                <th>品牌</th>
                <th>状态</th>
                <th>申请时间</th>
              </tr>
            </thead>
            <tbody>
          {this.state.data.map(function(item){
            return (
              <tr key={item.applyId}>
                <td>{item.applyId}</td>
                <td>{item.applyBrand}</td>
                <td>{item.verify}</td>
                <td>{item.addTime}</td>
              </tr>
            );
          }.bind(this))}
            </tbody>
          </table>
          <Pagination url="./data.js" callback={this.callback} condition={this.state.condition}></Pagination>
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.body);