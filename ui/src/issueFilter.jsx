import React from 'react';
import { Link } from 'react-router-dom';

/* eslint-disable-next-line react/prefer-stateless-function */
export default class IssueFilter extends React.Component {
    render() {
        return (
            <div>
                <Link to="/issues">All</Link>
                {' | '}
                <Link to={{ pathname: '/issues', search: '?status=New' }}>New Issues</Link>
                {' | '}
                <Link to={{ pathname: '/issues', search: '?status=Assigned' }}>Assigned</Link>
            </div>
        );
    }
}
