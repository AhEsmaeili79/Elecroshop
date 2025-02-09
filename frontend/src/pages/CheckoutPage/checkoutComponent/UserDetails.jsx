const UserDetails = ({ userData }) => {
    return (
      userData && (
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <label>نام *</label>
              <input type="text" className="form-control rounded-lg" value={userData.first_name} disabled />
            </div>
          </div>
          <div className="col-sm-6">
            <div className="form-group">
              <label>نام خانوادگی *</label>
              <input type="text" className="form-control rounded-lg" value={userData.last_name} disabled />
            </div>
          </div>
        </div>
      )
    );
  };
  
  export default UserDetails;
  