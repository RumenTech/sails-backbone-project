'use strict';

module.exports = {

    setParams:function (req) {
        var criteriaParameters = {};
        var limit = req.param('limit'),
            offset = req.param('offset'),
            student_name = req.param('name'),
            company = req.param('company'),
            major = req.param('major'),
            alma_mater = req.param('school'),
            job_title = req.param('job_title'),
            gpa = req.param('gpa'),
            experiences = req.param('experiences'),
            gpa_criteria = req.param('gpa_criteria'),
            skill_name = req.param('talent_skill');

        criteriaParameters.limit =  limit || 100;
        criteriaParameters.offset = offset || 0;
        criteriaParameters.student_name = student_name || '';
        criteriaParameters.company = company || '';
        criteriaParameters.major = major || '';
        criteriaParameters.alma_mater = alma_mater || '';
        criteriaParameters.job_title = job_title || '';
        criteriaParameters.gpa = gpa || 0;
        criteriaParameters.experiences = experiences || [];
        criteriaParameters.gpa_criteria = gpa_criteria || 'IS NULL';
        criteriaParameters.skill_name = skill_name || '';

        return criteriaParameters;
    }
};