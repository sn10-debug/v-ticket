CREATE OR REPLACE VIEW attendance_view AS
SELECT
    A.id AS attendance_id,
    U.reg_no AS user_reg,
    U.name AS user_name,
    E.name AS event_name,
    E.date AS event_date
FROM
    public."Attendance" A
    INNER JOIN public."User" U ON A."userId" = U.id
    INNER JOIN public."Events" E ON A."eventsId" = E.id;

CREATE OR REPLACE VIEW InTimeView AS
SELECT 
I."id" AS intime_id,
I."inTime" AS intime_entry,
U."name" AS username,
U."reg_no" AS reg_no,
E."name" AS eventname,
E."date" AS eventdate
FROM public."InOutTime" I
INNER JOIN public."Attendance" A ON I."attendanceId" = A.id
INNER JOIN public."Events" E ON A."eventsId" = E.id
INNER JOIN public."User" U ON A."userId" = U.id
ORDER BY I."inTime" DESC; 
