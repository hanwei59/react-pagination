/**
 * Created by hanwei on 15/3/30.
 */
var React = require('react');

var Grid = React.createClass({
  render: function(){
    var data = this.props.data;
    var rows = data.map(function(item,key){
      return (
        <tr key={key}>
          {this.props.columns.filter((col) => col.show == undefined ? true : col.show).map((col,k) => {
            var colValue = item[col.field];
            if(col.checkbox){
              var checked = this.props.checkedIds.join(',').indexOf(colValue) > -1;
              colValue = <input type="checkbox" data-id={colValue} checked={checked}
                                onChange={this._handleCheckOne.bind(this,colValue)}/>
            }
            if(col.fmt){
              colValue = col.fmt(item);
            }
            return <td key={k}>{colValue}</td>
          })}
        </tr>
      );
    }.bind(this));
    if(!data || data.length == 0){
      rows = <tr><td className="dataTables_empty" colSpan={this.props.columns.length}>暂无记录</td></tr>;
    }
    return (
      <div className="row">
        <table className="table table-bordered table-striped dataTable">
          <thead>
          <tr>
            {this.props.columns.filter((v) => v.show == undefined ? true : v.show).map((v,k) => {
              var colName = v.name;
              if(v.checkbox){
                var uncheckedIds = this.props.data.filter((item) => {
                  var id = item[this.props.columns[0].field];
                  return this.props.checkedIds.join(',').indexOf(id) == -1;
                });
                colName = <input type="checkbox" checked={uncheckedIds.length == 0 && this.props.data.length > 0}
                                 name={v.field} onChange={this._handleCheckAll}/>;
              }
              return <th key={k}>{colName}</th>
            })}
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
      </div>
    );
  },
  /**
   * 点击全选按钮
   * @param e
   * @private
   */
  _handleCheckAll(e) {
    var idList = [];
    $.each(this.props.data,function (index,row) {
      idList.push(row[this.props.columns[0].field]);
    }.bind(this));
    this.props.onAllChecked(e.target.checked, idList);
  },
  /**
   * 点击每一行选择框
   * @param id
   * @param e
   * @private
   */
  _handleCheckOne(id,e) {
    this.props.onOneChecked(e.target.checked, id);
  }
});

module.exports = Grid;