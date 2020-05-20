/* create timeline */
var timeline = [];

/* define the site that hosts stimuli images*/
var repo_site = "https://D-Arness.github.io/Simple-Go-NoGo-Task/";

/* define welcome message trial */
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};
timeline.push(welcome);

/* define instructions trial */
var instructions = {
  type: "html-keyboard-response",
  stimulus: "<p>In this experiment, a circle will appear in the centre " +
    "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
    "press SPACE on your keyboard as fast as you can.</p>" +
    "<p>If the circle is <strong>orange</strong>, do not press any key, " +
    "wait for the next trial.</p>" +
    "<div style='width: 700px;'>" +
    "<div style='float: left;'><img src='" + repo_site + "img/blue.png'/>" +
    "<p class='small'><strong>Press SPACE</strong></p></div>" +
    "<div class='float: right;'><img src='" + repo_site + "img/orange.png'/>" +
    "<p class='small'><strong>Press nothing!</strong></p></div>" +
    "</div>" +
    "<p>Press any key to begin.</p>",
  post_trial_gap: 800
};
timeline.push(instructions);

/* test trials */
var test_stimuli = [
  { stimulus: repo_site + "img/blue.png", data: { test_part: 'test', correct_response: 'space' } },
  { stimulus: repo_site + "img/orange.png", data: { test_part: 'test', correct_response: 'null' } }
];

var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: function () {
    return jsPsych.randomization.sampleWithReplacement([750, 1000, 1250], 1)[0];
  },
  data: { test_part: 'fixation' }
}

var test = {
  type: "image-keyboard-response",
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['space'],
  trial_duration: 2000,
  data: jsPsych.timelineVariable('data'),
  on_finish: function (data) {
    data.correct = data.key_press === jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
  },
};

var test_procedure = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  repetitions: 5,
  randomize_order: true
}
timeline.push(test_procedure);

/* define debrief */
var debrief_block = {
  type: "html-keyboard-response",
  stimulus: function () {

    var trials = jsPsych.data.get().filter({ test_part: 'test' });
    var correct_trials = trials.filter({ correct: true });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    var rt = Math.round(correct_trials.select('rt').mean());

    return "<p>You responded correctly on " + accuracy + "% of the trials.</p>" +
      "<p>Your average response time was " + rt + "ms.</p>" +
      "<p>Press any key to complete the experiment. Thank you!</p>";

  }
};
timeline.push(debrief_block);
