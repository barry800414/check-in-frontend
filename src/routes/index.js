import React from 'react';
import { Route } from 'react-router';

import BlackRoot from './Root/BlackRoot';
import WhiteRoot from './Root/WhiteRoot';
import TotalWorkingTime from './TotalWorkingTime';
import CheckInList from './CheckInList';

export default (
    <div>
        <Route component={BlackRoot}>
            <Route path="/" component={TotalWorkingTime} />
        </Route>
        <Route component={WhiteRoot}>
            <Route path="/check-ins/:key" component={CheckInList} />
        </Route>
    </div>
);
