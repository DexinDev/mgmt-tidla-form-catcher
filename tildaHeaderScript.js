const checkStep = (() => {
    //The profile localStorage records aren't clear after Tilda session ends.
    if(!localStorage.tilda_members_profile9985797 || location.pathname.search('members') >= 0) return false;
    
    const email = JSON.parse(localStorage.tilda_members_profile9985797).login;

    const redirect = ((stepsProgress) => {
        const stepsOrder = [
            'cosmetic',
            'atp',
            'office',
            'store',
            'rc',
            'general',
            'bf',
            'factory',
            'pharmacy',
            'delivery',
        ];

        const stepsCount = stepsOrder.length;

        let complete = stepsProgress[stepsOrder[0]];
        let nextStep = 0;

        while(complete == true) {
            nextStep++;
            complete = stepsProgress[stepsOrder[nextStep]];
        }

        location.replace(``);

    });
    
    fetch('https://backend.url', {method: 'post', body: JSON.stringify({ email: email })})
    .then((response) => response.json())

    /** Redirect user to the next step. */
    .then((data) => {
        
    });



});

checkStep();