import React from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';

const TeamTable = ({ data }) => {
    // Fallback to empty array if no data provided, or separate loading state
    return (
        <DataTable columns={columns} data={data || []} />
    );
};

export default TeamTable;
