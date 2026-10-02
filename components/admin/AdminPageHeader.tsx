import React from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header-titles">
        <div className="admin-page-title-row">
          <h1 className="admin-page-title">{title}</h1>
        </div>
      </div>

      {action && <div className="admin-page-header-actions">{action}</div>}
    </div>
  );
}
