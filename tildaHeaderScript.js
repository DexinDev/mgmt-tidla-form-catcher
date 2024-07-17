const checkStep = (() => {
    //The profile localStorage records aren't clear after Tilda session ends.
    if(!localStorage.tilda_members_profile9985797 || location.pathname.search('members') >= 0) return false;
    
    const email = JSON.parse(localStorage.tilda_members_profile9985797).login;
    
    fetch('https://backend.url', {method: 'post', body: JSON.stringify({ email: email })})
    .then((response) => response.json())

    /** Redirect user to the next step.
     * Steps are:
     *  cosmetic,
     *  atp,
     *  office,
     *  store,
     *  rc,
     *  general,
     *  bf,
     *  factory,
     *  pharmacy,
     *  delivery
    */

    .then((data) => {
        if(data.cosmetic && data.atp && data.office && data.store && data.rc && data.general) {
            if(location.pathname !== '/final') location.replace('/final');
        } else if(data.cosmetic && data.atp && data.office && data.store && data.rc) {
            if(location.pathname !== '/general') location.replace('/general');
        } else if(data.cosmetic && data.atp && data.office && data.store) {
            if(location.pathname !== '/rc') location.replace('/rc');
        } else if(data.cosmetic && data.atp && data.office) {
            if(location.pathname !== '/store') location.replace('/store');
        } else if(data.cosmetic && data.atp) {
            if(location.pathname !== '/office') location.replace('/office');
        } else if(data.cosmetic) {
            if(location.pathname !== '/atp') location.replace('/atp');
        } else {
           if(location.pathname !== '/cosmetic') location.replace('/cosmetic'); 
        }
    });

});

checkStep();