import { useState } from 'react';
import BreadCrumb from '../../components/Breadcrumb/BreadCrumb';
import DashboardAside from './ProfilePageAside';
import UserDetailHeader from '../../components/Header/UserDetailHeader/UserDetailHeader';
import AccountForm from './TabContents/AccountForm';
import AddressComponent from './Addresses/AddressComponent';
import OrdersList from '../OrderListPage/OrdersList';
import { logoutUser } from '../../api/auth';

const handleLogout = async () => {
    try {
      await logoutUser(localStorage.getItem('refresh_token'), localStorage.getItem('token'));
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/'; 
    }
  };

const Body = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const renderTabContent = () => {
        switch (activeTab) {
            case "account":
                return <AccountForm />;
            case "address":  // Add this case to render the AddressComponent
                return <AddressComponent />;
            // Add other cases for different tabs as needed
            case "orders":  // Add this case to render the AddressComponent
                return <OrdersList />;
            default:
                return <div>Welcome to the Dashboard</div>;
        }
    };

    return (
        <>
            <main className="main">
                <UserDetailHeader />
                <BreadCrumb />
                <div className="page-content">
                    <div className="container">
                        <div className="row">
                            <DashboardAside handleLogout={handleLogout} setActiveTab={setActiveTab} />
                            <div className="col-md-8 col-lg-9">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Body;
