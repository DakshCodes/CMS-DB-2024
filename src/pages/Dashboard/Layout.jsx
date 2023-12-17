import React from 'react';

export default function DashboardLayout({ children }) {
  // You can add additional logic here if needed
  // const { userId } = useauth();

  // if (!userId) {
  //   push('/login');
  // }

  // const store = await find store

  // if (!store) {
  //   push('/');
  // };

  return (
    <main className="dashboard-content">
      {children} {/* Display children here */}
    </main>
  );
}
