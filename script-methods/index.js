import Agenda from '../jobs/config';

const ScriptMethods = async ({
    method,
    ...rest
}) => {
    console.log('\n\n', 'method', method);
    console.log('\n\n', { rest });

    switch (method) {
    // http://localhost:4000/script?method=StartDashboardJob
    case 'StartDashboardJob': {
        Agenda.create('create-dashboard-stats', {
            type: 'DashboardJob'
        }).unique({
            'data.type': 'DashboardJob'
        })
            .repeatEvery('15 minutes')
            .schedule('in 10 seconds')
            .save();

        console.log('\n\n', 'Dashboard Job Has Been Started');

        break;
    }
    }
};

export default ScriptMethods;