const Parse = require('parse/node');
const soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

class Admin {
  /**
   * gets data for any SOLE sessions that haven't been approved or rejected yet
   * @param sessionToken string
   * @returns {Parse.Promise|PromiseLike<T | never>|Promise<T | never>|*} array of soles
   */
  static getPendingSoles (sessionToken) {
    return Parse.Cloud.run('webapp.getUnapprovedSoles', {
      limit: 999,
      sessionToken: sessionToken
    }).then(solesJson => {
      return Promise.resolve(solesJson);
    });
  }

  /*
    param:
        soleId - string
        comment - string
        sessionToken - string
     returns
        promise with soleId

     */
  static approveSole (soleId, comment, requestSocialMedia, sessionToken) {
    return Parse.Cloud.run('webapp.approveSole', {
      id: soleId,
      comment: comment,
      requestSocialMedia: requestSocialMedia,
      sessionToken: sessionToken
    });
  };

  //reject a sole and share feedback
  static rejectSole (soleId, comment, sessionToken) {
    return Parse.Cloud.run('webapp.rejectSole', {
      id: soleId,
      comment: comment,
      sessionToken: sessionToken
    });
  };


  //get questions for admin management
  static getLeaflessQuestions (sessionToken) {
    // return Parse.Cloud.run('webapp.getLeaflessQuestions', {
    //   sessionToken: sessionToken
    // });
    const questions = [
      {
        "id": "vygFpDTqIp",
        "text": "Can any 3 side lengths create a triangle? ",
        "sourceURL": "https://startsole.org",
        "tags": [
          "edu.6",
          "edu.middleschool",
          "edu.prekto12",
          "top.math"
        ],
        "tagsTitles": {
          "edu.6": "Sixth Grade",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "O49YjzheRQ",
        "text": "How does alcohol impact someones triangle of health?",
        "sourceURL": "https://startsole.org",
        "tags": [
          "edu.9",
          "edu.highschool",
          "edu.prekto12",
          "top.health"
        ],
        "tagsTitles": {
          "edu.9": "Ninth Grade",
          "top.health": "Health"
        },
        "approved": true
      },
      {
        "id": "RoBkfg7wtG",
        "text": "How do civil engineers use the area of triangles, polygons, and special quadrilaterals when mapping out a city?",
        "approved": true
      },
      {
        "id": "lCFSBx6p4I",
        "text": "How did the triangle trade lead countries to depend on each other?",
        "sourceURL": "https://startsole.org",
        "tags": [
          "edu.8",
          "edu.middleschool",
          "edu.prekto12",
          "top.socialstudies"
        ],
        "tagsTitles": {
          "edu.8": "Eighth Grade",
          "top.socialstudies": "Social Studies"
        },
        "approved": true
      },
      {
        "id": "mZI5Td0wo5",
        "text": "How can you prove two triangle congruent?",
        "tags": [
          "edu.10",
          "edu.highschool",
          "edu.prekto12",
          "top.math"
        ],
        "tagsTitles": {
          "edu.10": "Tenth Grade",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "JZUj14HfOw",
        "text": "How can we prove two triangles are congruent?",
        "tags": [
          "edu.10",
          "edu.highschool",
          "edu.prekto12",
          "top.math"
        ],
        "tagsTitles": {
          "edu.10": "Tenth Grade",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "KOd77fin1w",
        "text": "How do determine if triangles are congruent? ",
        "tags": [
          "edu.9",
          "edu.highschool",
          "edu.prekto12",
          "top.math"
        ],
        "tagsTitles": {
          "edu.9": "Ninth Grade",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "SLrQgyG2nH",
        "text": "How do you find the missing side of a right triangle when given two sides?",
        "sourceURL": "https://app.startsole.org/#!/home",
        "tags": [
          "edu.8",
          "edu.middleschool",
          "edu.prekto12",
          "top.math"
        ],
        "tagsTitles": {
          "edu.8": "Eighth Grade",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "OBcptkZop1",
        "text": "How do the Binomial Theorem and Pascal's triangle help determine the probability of an outcome?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s1143632",
          "asn.s114358f",
          "asn.s1143558",
          "asn.s114354e",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s1143632": "CCSS.Math.Content.HSA-APR.C.5",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114354e": "High School — Algebra",
          "asn.s1143558": "Arithmetic with Polynomials and Rational Expressions",
          "asn.s114358f": "CCSS.Math.Content.HSA-APR.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563706": "CC.2.2.HS.D.5",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563610": "CC.2.2",
          "asn.s2563701": "Algebra",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "dUaugdClhn",
        "text": "What do right triangles have to do with deriving the equations for ellipses and hyperbolas?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435dd",
          "asn.s114357c",
          "asn.s1143562",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435dd": "CCSS.Math.Content.HSG-GPE.A.3",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143562": "Expressing Geometric Properties with Equations",
          "asn.s114357c": "CCSS.Math.Content.HSG-GPE.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "etWDfRerml",
        "text": "How do civil engineers use the area of triangles, polygons, and special quadrilaterals when mapping out a city?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11434e2",
          "asn.s11434ca",
          "asn.s114340d",
          "asn.d10003fb",
          "jur.ccss",
          "edu.6",
          "edu.middleschool",
          "edu.prekto12",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s11434e2": "CCSS.Math.Content.6.G.A.1",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114340d": "Geometry",
          "asn.s11434ca": "CCSS.Math.Content.6.G.A",
          "edu.6": "Sixth Grade",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563724": "CC.2.3.6.A.1",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "e2ybOHYRYe",
        "text": "How do contestants on the show Project Runway use rigid motions to show congruence with triangles?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435c4",
          "asn.s1143573",
          "asn.s114355f",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435c4": "CCSS.Math.Content.HSG-CO.B.7",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s114355f": "Congruence",
          "asn.s1143573": "CCSS.Math.Content.HSG-CO.B",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563731": "CC.2.3.HS.A.2",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "55FrIBsGFR",
        "text": "How do 3-D printers rely on exterior angles of triangles and transversals to create an object?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s1143541",
          "asn.s114353c",
          "asn.s114340d",
          "asn.d10003fb",
          "jur.ccss",
          "edu.8",
          "edu.middleschool",
          "edu.prekto12",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s1143541": "CCSS.Math.Content.8.G.A.5",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114340d": "Geometry",
          "asn.s114353c": "CCSS.Math.Content.8.G.A",
          "edu.8": "Eighth Grade",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563727": "CC.2.3.8.A.1",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "ajLDKy3mNv",
        "text": "How do you construct equilateral triangles, squares, and regular hexagons to fit inside a circle?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435ca",
          "asn.s1143575",
          "asn.s114355f",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435ca": "CCSS.Math.Content.HSG-CO.D.13",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s114355f": "Congruence",
          "asn.s1143575": "CCSS.Math.Content.HSG-CO.D",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "BUBXAP4iLx",
        "text": "How does Nate Silver use Pascal's Triangle to predict who will win the NCAA basketball tournament?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s1143632",
          "asn.s114358f",
          "asn.s1143558",
          "asn.s114354e",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s1143632": "CCSS.Math.Content.HSA-APR.C.5",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114354e": "High School — Algebra",
          "asn.s1143558": "Arithmetic with Polynomials and Rational Expressions",
          "asn.s114358f": "CCSS.Math.Content.HSA-APR.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563706": "CC.2.2.HS.D.5",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563610": "CC.2.2",
          "asn.s2563701": "Algebra",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "9vAuW7zTYN",
        "text": "How do aerial surveyors use triangle similarity?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cc",
          "asn.s1143576",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435cc": "CCSS.Math.Content.HSG-SRT.A.2",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143576": "CCSS.Math.Content.HSG-SRT.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "aqCSCgVIJ0",
        "text": "Why are right triangles so important in furniture making?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d0",
          "asn.s1143578",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d0": "CCSS.Math.Content.HSG-SRT.C.6",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143578": "CCSS.Math.Content.HSG-SRT.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563736": "CC.2.3.HS.A.7",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "qjq3474ptP",
        "text": "How can we prove theorems about triangles?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435c7",
          "asn.s1143574",
          "asn.s114355f",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435c7": "CCSS.Math.Content.HSG-CO.C.10",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s114355f": "Congruence",
          "asn.s1143574": "CCSS.Math.Content.HSG-CO.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563735": "CC.2.3.HS.A.6",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania",
          "asn.s2563732": "CC.2.3.HS.A.3"
        },
        "approved": true
      },
      {
        "id": "cwG6GHEeCx",
        "text": "How can we prove two triangles are congruent?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435c4",
          "asn.s1143573",
          "asn.s114355f",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435c4": "CCSS.Math.Content.HSG-CO.B.7",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s114355f": "Congruence",
          "asn.s1143573": "CCSS.Math.Content.HSG-CO.B",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563731": "CC.2.3.HS.A.2",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "AWdcKXd6Im",
        "text": "Why would we need to prove similarities about triangles?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435ce",
          "asn.s1143577",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435ce": "CCSS.Math.Content.HSG-SRT.B.4",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143577": "CCSS.Math.Content.HSG-SRT.B",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563735": "CC.2.3.HS.A.6",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "D82StGISy8",
        "text": "How can triangles help to find the components of a vector?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s114361f",
          "asn.s114359c",
          "asn.s1143556",
          "asn.s114354d",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s114361f": "CCSS.Math.Content.HSN-VM.A.2",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114354d": "High School — Number and Quantity",
          "asn.s1143556": "Vector and Matrix Quantities",
          "asn.s114359c": "CCSS.Math.Content.HSN-VM.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "wjfnSGsF9v",
        "text": "How can we find the area of any triangle?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d3",
          "asn.s1143579",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d3": "CCSS.Math.Content.HSG-SRT.D.9",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143579": "CCSS.Math.Content.HSG-SRT.D",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "mWXdzn36x5",
        "text": "Why are theorems about triangles so important to architects?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435c7",
          "asn.s1143574",
          "asn.s114355f",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435c7": "CCSS.Math.Content.HSG-CO.C.10",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s114355f": "Congruence",
          "asn.s1143574": "CCSS.Math.Content.HSG-CO.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563735": "CC.2.3.HS.A.6",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania",
          "asn.s2563732": "CC.2.3.HS.A.3"
        },
        "approved": true
      },
      {
        "id": "4aVgSN8jje",
        "text": "How do we use ratios and the Pythagoream Theorem to solve right triangles?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d2",
          "asn.s1143578",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d2": "CCSS.Math.Content.HSG-SRT.C.8",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143578": "CCSS.Math.Content.HSG-SRT.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "c2obL9hrNo",
        "text": "How are right triangles important in sports?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11434b4",
          "asn.s1143499",
          "asn.s114340d",
          "asn.d10003fb",
          "jur.ccss",
          "edu.4",
          "edu.elementaryschool",
          "edu.prekto12",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s11434b4": "CCSS.Math.Content.4.G.A.2",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114340d": "Geometry",
          "asn.s1143499": "CCSS.Math.Content.4.G.A",
          "edu.4": "Fourth Grade",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563641": "C.2.3.4.A.2",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "NbzNI0HS0e",
        "text": "If one angle in a triangle changes, what happens to the other two angles?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s1143519",
          "asn.s1143509",
          "asn.s114340d",
          "asn.d10003fb",
          "jur.ccss",
          "edu.7",
          "edu.middleschool",
          "edu.prekto12",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s1143519": "CCSS.Math.Content.7.G.A.2",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114340d": "Geometry",
          "asn.s1143509": "CCSS.Math.Content.7.G.A",
          "edu.7": "Seventh Grade",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "jc8ew2jCe4",
        "text": "How can we find the center of any triangle?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d8",
          "asn.s114357a",
          "asn.s1143561",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d8": "CCSS.Math.Content.HSG-C.A.3",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143561": "Circles",
          "asn.s114357a": "CCSS.Math.Content.HSG-C.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.hrsa0423": "G 701. Use relationships among angles, arcs, and distances in a circle",
          "asn.d0000004": "HRSA",
          "asn.hrsa0002": "Math",
          "asn.hrsa0014": "Geometry (G)",
          "asn.hrsa0084": "33-36 (700)",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.oh": "Ohio",
          "top.health": "Health"
        },
        "approved": true
      },
      {
        "id": "Na4gtWrWFa",
        "text": "How did the Wright Brothers use triangle similarity to land their plane?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cc",
          "asn.s1143576",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435cc": "CCSS.Math.Content.HSG-SRT.A.2",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143576": "CCSS.Math.Content.HSG-SRT.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "SEtT3WdXBE",
        "text": "How can we prove theorems about similar triangles?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435ce",
          "asn.s1143577",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435ce": "CCSS.Math.Content.HSG-SRT.B.4",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143577": "CCSS.Math.Content.HSG-SRT.B",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563735": "CC.2.3.HS.A.6",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "w4EUnGougX",
        "text": "How are ratios for acute angles in right triangles like fractals?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d0",
          "asn.s1143578",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d0": "CCSS.Math.Content.HSG-SRT.C.6",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143578": "CCSS.Math.Content.HSG-SRT.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563736": "CC.2.3.HS.A.7",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "nb1MGxlHEx",
        "text": "Why are triangles so important to finding area?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11434e2",
          "asn.s11434ca",
          "asn.s114340d",
          "asn.d10003fb",
          "jur.ccss",
          "edu.6",
          "edu.middleschool",
          "edu.prekto12",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s11434e2": "CCSS.Math.Content.6.G.A.1",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114340d": "Geometry",
          "asn.s11434ca": "CCSS.Math.Content.6.G.A",
          "edu.6": "Sixth Grade",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563724": "CC.2.3.6.A.1",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "RZjzlDcUrC",
        "text": "Are all triangles the same?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s114342a",
          "asn.s1143416",
          "asn.s114340d",
          "asn.d10003fb",
          "jur.ccss",
          "edu.k",
          "edu.elementaryschool",
          "edu.prekto12",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s114342a": "CCSS.Math.Content.K.G.B.4",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s114340d": "Geometry",
          "asn.s1143416": "CCSS.Math.Content.K.G.B",
          "edu.k": "Kindergarten",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563633": "CC.2.3.K.A.2",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "I4F6Y410Mx",
        "text": "What is the relationship between the sine and cosine of complementary angles?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d1",
          "asn.s1143578",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d1": "CCSS.Math.Content.HSG-SRT.C.7",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143578": "CCSS.Math.Content.HSG-SRT.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563736": "CC.2.3.HS.A.7",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "kWJhmVjDQE",
        "text": "How is the relationship between sine and cosine used with complementary angles in the real world?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d1",
          "asn.s1143578",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d1": "CCSS.Math.Content.HSG-SRT.C.7",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143578": "CCSS.Math.Content.HSG-SRT.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563736": "CC.2.3.HS.A.7",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "XZarlKZCIY",
        "text": "How can we experimentally verify the properties of dilations?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cb",
          "asn.s1143576",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s11435cb": "CCSS.Math.Content.HSG-SRT.A.1",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143576": "CCSS.Math.Content.HSG-SRT.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563734": "CC.2.3.HS.A.5",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "cdw0vw5520",
        "text": "What does \"similarity\" mean in geometry?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cb",
          "asn.s1143576",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math"
        ],
        "tagsTitles": {
          "asn.s11435cb": "CCSS.Math.Content.HSG-SRT.A.1",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143576": "CCSS.Math.Content.HSG-SRT.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math",
          "asn.s2563734": "CC.2.3.HS.A.5",
          "asn.d2563472": "PA Core - Mathematics (PreK-12)",
          "asn.s2563628": "CC.2.3",
          "asn.s2563629": "Geometry",
          "edu.10": "Tenth Grade",
          "edu.11": "Eleventh Grade",
          "edu.12": "Twelfth Grade",
          "edu.9": "Ninth Grade",
          "jur.pa": "Pennsylvania"
        },
        "approved": true
      },
      {
        "id": "h49CMhGycP",
        "text": "How do submarine captains know which angles to take to submerge and re-emerge?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cd",
          "asn.s1143576",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435cd": "CCSS.Math.Content.HSG-SRT.A.3",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143576": "CCSS.Math.Content.HSG-SRT.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "7M2GWjBhAR",
        "text": "How do lumberjacks know if a tree will crash into a house before cutting the tree down?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cf",
          "asn.s1143577",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435cf": "CCSS.Math.Content.HSG-SRT.B.5",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143577": "CCSS.Math.Content.HSG-SRT.B",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "imKeLYSFSP",
        "text": "Why does a mechanical engineer need to use the Laws of Sines and Cosines?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d4",
          "asn.s1143579",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d4": "CCSS.Math.Content.HSG-SRT.D.10",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143579": "CCSS.Math.Content.HSG-SRT.D",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "cvmgoMgi7t",
        "text": "How do lumber yards know how to make trusses?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d5",
          "asn.s1143579",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d5": "CCSS.Math.Content.HSG-SRT.D.11",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143579": "CCSS.Math.Content.HSG-SRT.D",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "vOXNzHCzzf",
        "text": "How do surveyors figure out the acreage of land parcels?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d3",
          "asn.s1143579",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d3": "CCSS.Math.Content.HSG-SRT.D.9",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143579": "CCSS.Math.Content.HSG-SRT.D",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "DQPHf8dW8a",
        "text": "How do firefighters know how close to pull their ladder truck to a building when they need to rescue someone?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cf",
          "asn.s1143577",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435cf": "CCSS.Math.Content.HSG-SRT.B.5",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143577": "CCSS.Math.Content.HSG-SRT.B",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "9pZeKyPHZy",
        "text": "How was the Eiffel Tower built?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d2",
          "asn.s1143578",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d2": "CCSS.Math.Content.HSG-SRT.C.8",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143578": "CCSS.Math.Content.HSG-SRT.C",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "1Byae8PdRt",
        "text": "How do fire departments know which station should respond to a fire?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d4",
          "asn.s1143579",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d4": "CCSS.Math.Content.HSG-SRT.D.10",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143579": "CCSS.Math.Content.HSG-SRT.D",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "HY23bTIfkx",
        "text": "How does AA criterion help different planes land on an aircraft carrier?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435cd",
          "asn.s1143576",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435cd": "CCSS.Math.Content.HSG-SRT.A.3",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143576": "CCSS.Math.Content.HSG-SRT.A",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      },
      {
        "id": "MxHC57kSXp",
        "text": "How do GPSs use the law of sines and cosines?",
        "sourceURL": "https://www.solecle.com/#/questions",
        "tags": [
          "asn.s11435d5",
          "asn.s1143579",
          "asn.s1143560",
          "asn.s1143551",
          "asn.d10003fb",
          "jur.ccss",
          "jur.organization",
          "top.math",
          "edu.9",
          "edu.10",
          "edu.11",
          "edu.12"
        ],
        "tagsTitles": {
          "asn.s11435d5": "CCSS.Math.Content.HSG-SRT.D.11",
          "asn.d10003fb": "Common Core State Standards for Mathematics",
          "asn.s1143551": "High School — Geometry",
          "asn.s1143560": "Similarity, Right Triangles, and Trigonometry",
          "asn.s1143579": "CCSS.Math.Content.HSG-SRT.D",
          "jur.ccss": "Common Core State Standards",
          "top.math": "Math"
        },
        "approved": true
      }
    ];
    return Parse.Promise.as(questions);
  };





  //
  // //get any questions that haven't been approved yet
  // //stub Todo: make this
  // static getPendingQuestions (sessionToken) {
  //     // return Parse.Cloud.run('webapp.getUnapprovedQuestions', {
  //     //     limit: 999,
  //     //     sessionToken: sessionToken
  //     // }).then(solesJson => {
  //     //     return Promise.resolve(solesJson);
  //     // });
  // }
  // /*
  // approve a given question
  // param:
  //     questionId - string id of question
  //     comment - string comment from approver (to be used in an email to the submitter)
  //     tags - array of string tags
  //     sessionToken - string sessionToken
  //  */
  // //stub Todo: make this
  // static approveQuestion (questionId, comment, sessionToken) {
  //
  //     // return Parse.Cloud.run('webapp.approveQuestion', {
  //     //     id: soleId,
  //     //     comment: comment,
  //     //     sessionToken: sessionToken
  //     // });
  // };
  //
  // /*
  // reject a given question
  // param:
  //     questionId - string id of question
  //     comment - string comment from rejector (to be used in an email to the submitter)
  //     sessionToken - string sessionToken
  //  */
  // //stub Todo: make this
  // static rejectQuestion (questionId, comment, sessionToken) {
  //     // return Parse.Cloud.run('webapp.rejectQuestion', {
  //     //     id: questionId,
  //     //     comment: comment,
  //     //     sessionToken: sessionToken
  //     // });
  // };

}

module.exports = Admin;


