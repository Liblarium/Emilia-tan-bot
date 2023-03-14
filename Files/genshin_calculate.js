module.exports = { //https://genshin-impact.fandom.com/ru/wiki/Ранг_приключений
    allLvl: (lvl) => {
        if (parseInt(lvl) < 1 || Number.isNaN(lvl)) {
            throw new Error(`${lvl} оказался меньше 1 или не числом. Занимайся фиксом.`);
        }
        let value = parseInt(lvl);
        if (value == 1) {
            return 0;
        }
        if (value == 2) {
            return 375;
        }
        if (value == 3) {
            return 875;
        }
        if (value == 4) {
            return 1500;
        }
        if (value == 5) {
            return 2225;
        }
        if (value == 6) {
            return 3075;
        }
        if (value == 7) {
            return 4025;
        }
        if (value == 8) {
            return 5100;
        }
        if (value == 9) {
            return 6275;
        }
        if (value == 10) {
            return 7575;
        }
        if (value == 11) {
            return 9000;
        }
        if (value == 12) {
            return 10525;
        }
        if (value == 13) {
            return 12175;
        }
        if (value == 14) {
            return 13950;
        }
        if (value == 15) {
            return 15825;
        }
        if (value == 16) {
            return 17825;
        }
        if (value == 17) {
            return 20200;
        }
        if (value == 18) {
            return 22700;
        }
        if (value == 19) {
            return 25325;
        }
        if (value == 20) {
            return 28100;
        }
        if (value == 21) {
            return 30925;
        }
        if (value == 22) {
            return 34350;
        }
        if (value == 23) {
            return 38075;
        }
        if (value == 24) {
            return 42075;
        }
        if (value == 25) {
            return 46375;
        }
        if (value == 26) {
            return 50950;
        }
        if (value == 27) {
            return 55825;
        }
        if (value == 28) {
            return 60975;
        }
        if (value == 29) {
            return 66425;
        }
        if (value == 30) {
            return 72150;
        }
        if (value == 31) {
            return 78175;
        }
        if (value == 32) {
            return 84475;
        }
        if (value == 33) {
            return 91075;
        }
        if (value == 34) {
            return 97975;
        }
        if (value == 35) {
            return 105150;
        }
        if (value == 36) {
            return 112625;
        }
        if (value == 37) {
            return 120375;
        }
        if (value == 38) {
            return 128425;
        }
        if (value == 39) {
            return 136750;
        }
        if (value == 40) {
            return 145375;
        }
        if (value == 41) {
            return 155925;
        }
        if (value == 42) {
            return 167450;
        }
        if (value == 43) {
            return 179925;
        }
        if (value == 44) {
            return 193375;
        }
        if (value == 45) {
            return 207775;
        }
        if (value == 46) {
            return 223125;
        }
        if (value == 47) {
            return 239450;
        }
        if (value == 48) {
            return 256725;
        }
        if (value == 49) {
            return 274175;
        }
        if (value == 50) {
            return 294175;
        }
        if (value == 51) {
            return 320575;
        }
        if (value == 52) {
            return 349375;
        }
        if (value == 53) {
            return 380575;
        }
        if (value == 54) {
            return 414175;
        }
        if (value == 55) {
            return 450175;
        }
        if (value == 56) {
            return 682525;
        }
        if (value == 57) {
            return 941475;
        }
        if (value == 58) {
            return 1227225;
        }
        if (value == 59) {
            return 1540050;
        }
        if (value == 60) {
            return 1880175;
        }
    },
    allXp: (xp) => {
        if (parseInt(xp) < 1 || Number.isNaN(xp)) {
            throw new Error(`${xp} оказался меньше 1 или не числом. Занимайся фиксом.`);
        }
        let value = parseInt(xp);
        if (value >= 0 && value <= 374) {
            return `1`;
        }
        if (value >= 375 && value <= 874) {
            return `2`;
        }
        if (value >= 875 && value <= 1499) {
            return `3`;
        }
        if (value >= 1500 && value <= 2224) {
            return `4`;
        }
        if (value >= 2325 && value <= 3074) {
            return `5`;
        }
        if (value >= 3075 && value <= 4024) {
            return `6`;
        }
        if (value >= 4025 && value <= 5099) {
            return `7`;
        }
        if (value >= 5100 && value <= 6274) {
            return `8`;
        }
        if (value >= 6275 && value <= 7574) {
            return `9`;
        }
        if (value >= 7575 && value <= 8999) {
            return `10`;
        }
        if (value >= 9000 && value <= 10524) {
            return `11`;
        }
        if (value >= 10525 && value <= 12174) {
            return `12`;
        }
        if (value >= 12175 && value <= 13949) {
            return `13`;
        }
        if (value >= 13950 && value <= 15824) {
            return `14`;
        }
        if (value >= 15825 && value <= 17824) {
            return `15`;
        }
        if (value >= 17825 && value <= 20199) {
            return `16`;
        }
        if (value >= 20200 && value <= 22899) {
            return `17`;
        }
        if (value >= 22700 && value <= 25324) {
            return `18`;
        }
        if (value >= 25325 && value <= 28099) {
            return `19`;
        }
        if (value >= 28100 && value <= 30924) {
            return `20`;
        }
        if (value >= 30925 && value <= 34349) {
            return `21`;
        }
        if (value >= 34350 && value <= 38074) {
            return `22`;
        }
        if (value >= 38075 && value <= 42074) {
            return `23`;
        }
        if (value >= 42075 && value <= 46374) {
            return `24`;
        }
        if (value >= 46374 && value <= 50949) {
            return `25`;
        }
        if (value >= 50950 && value <= 55824) {
            return `26`;
        }
        if (value >= 55825 && value <= 60974) {
            return `27`;
        }
        if (value >= 60975 && value <= 66424) {
            return `28`;
        }
        if (value >= 66424 && value <= 72149) {
            return `29`;
        }
        if (value >= 72150 && value <= 78174) {
            return `30`;
        }
        if (value >= 78175 && value <= 84474) {
            return `31`;
        }
        if (value >= 84475 && value <= 91074) {
            return `32`;
        }
        if (value >= 91075 && value <= 97974) {
            return `33`;
        }
        if (value >= 97975 && value <= 105149) {
            return `34`;
        }
        if (value >= 105150 && value <= 112624) {
            return `35`;
        }
        if (value >= 112625 && value <= 120374) {
            return `36`;
        }
        if (value >= 120375 && value <= 128424) {
            return `37`;
        }
        if (value >= 128425 && value <= 136749) {
            return `38`;
        }
        if (value >= 136750 && value <= 145374) {
            return `39`;
        }
        if (value >= 145375 && value <= 155924) {
            return `40`;
        }
        if (value >= 155924 && value <= 167449) {
            return `41`;
        }
        if (value >= 167450 && value <= 179924) {
            return `42`;
        }
        if (value >= 179925 && value <= 193374) {
            return `43`;
        }
        if (value >= 193375 && value <= 207774) {
            return `44`;
        }
        if (value >= 207775 && value <= 223124) {
            return `45`;
        }
        if (value >= 223125 && value <= 239449) {
            return `46`;
        }
        if (value >= 239450 && value <= 256724) {
            return `47`;
        }
        if (value >= 256725 && value <= 274974) {
            return `48`;
        }
        if (value >= 274975 && value <= 294174) {
            return `49`;
        }
        if (value >= 294175 && value <= 320574) {
            return `50`;
        }
        if (value >= 320575 && value <= 349374) {
            return `51`;
        }
        if (value >= 349375 && value <= 380574) {
            return `52`;
        }
        if (value >= 380575 && value <= 414174) {
            return `53`;
        }
        if (value >= 414175 && value <= 450174) {
            return `54`;
        }
        if (value >= 450175 && value <= 682524) {
            return `55`;
        }
        if (value >= 682525 && value <= 941474) {
            return `56`;
        }
        if (value >= 941475 && value <= 1227224) {
            return `57`;
        }
        if (value >= 1227225 && value <= 1540049) {
            return `58`;
        }
        if (value >= 1540050 && value <= 1880174) {
            return `59`;
        }
        if (value >= 1880175) {
            return `60`;
        }
    },
    allNextLvlXp: (lvl) => {
        if (parseInt(lvl) < 1 || Number.isNaN(lvl)) {
            throw new Error(`${lvl} оказался меньше 1 или не числом. Занимайся фиксом.`);
        }
    let value = parseInt(lvl);
        if (value == 1) {
            return 375;
        }
        if (value == 2) {
            return 500;
        }
        if (value == 3) {
            return 625;
        }
        if (value == 4) {
            return 725;
        }
        if (value == 5) {
            return 850;
        }
        if (value == 6) {
            return 950;
        }
        if (value == 7) {
            return 1075;
        }
        if (value == 8) {
            return 1175;
        }
        if (value == 9) {
            return 1300;
        }
        if (value == 10) {
            return 1425;
        }
        if (value == 11) {
            return 1525;
        }
        if (value == 12) {
            return 1650;
        }
        if (value == 13) {
            return 1775;
        }
        if (value == 14) {
            return 1875;
        }
        if (value == 15) {
            return 2000;
        }
        if (value == 16) {
            return 2375;
        }
        if (value == 17) {
            return 2500;
        }
        if (value == 18) {
            return 2625;
        }
        if (value == 19) {
            return 2775;
        }
        if (value == 20) {
            return 2825;
        }
        if (value == 21) {
            return 3425;
        }
        if (value == 22) {
            return 3725;
        }
        if (value == 23) {
            return 4000;
        }
        if (value == 24) {
            return 4300;
        }
        if (value == 25) {
            return 4575;
        }
        if (value == 26) {
            return 4875;
        }
        if (value == 27) {
            return 5150;
        }
        if (value == 28) {
            return 5450;
        }
        if (value == 29) {
            return 5725;
        }
        if (value == 30) {
            return 6025;
        }
        if (value == 31) {
            return 6300;
        }
        if (value == 32) {
            return 6600;
        }
        if (value == 33) {
            return 6900;
        }
        if (value == 34) {
            return 7175;
        }
        if (value == 35) {
            return 7475;
        }
        if (value == 36) {
            return 7750;
        }
        if (value == 37) {
            return 8050;
        }
        if (value == 38) {
            return 8325;
        }
        if (value == 39) {
            return 8625;
        }
        if (value == 40) {
            return 10550;
        }
        if (value == 41) {
            return 11525;
        }
        if (value == 42) {
            return 12475;
        }
        if (value == 43) {
            return 13450;
        }
        if (value == 44) {
            return 14400;
        }
        if (value == 45) {
            return 15350;
        }
        if (value == 46) {
            return 16325;
        }
        if (value == 47) {
            return 17275;
        }
        if (value == 48) {
            return 18250;
        }
        if (value == 49) {
            return 19200;
        }
        if (value == 50) {
            return 26400;
        }
        if (value == 51) {
            return 28800;
        }
        if (value == 52) {
            return 31200;
        }
        if (value == 53) {
            return 33600;
        }
        if (value == 54) {
            return 36000;
        }
        if (value == 55) {
            return 232350;
        }
        if (value == 56) {
            return 258950;
        }
        if (value == 57) {
            return 285750;
        }
        if (value == 58) {
            return 312825;
        }
        if (value == 59) {
            return 340125;
        }
        if (value == 60) {
            return 0;
        }
    }
}