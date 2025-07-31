const kinematics = {
    
    getFinalVelocityNoY({startVelocity, time, gravity}) {
    let finalVelocity = 0;
    finalVelocity = startVelocity + (gravity * time);
    return finalVelocity;
    }

};

export default kinematics;