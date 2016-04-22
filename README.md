## About

This is a small standalone repro for 2 issues in cucumber-js.

After cloning, run the repro using `./run-repro.sh <vesion-of-cucumber-js>`
`<vesion-of-cucumber-js>` is the version you wish to test, eg. 0.10.2, 0.9.5

When run with 0.10.2 you should see a number of failed cucumber runs, the last
of which will hang. Kill the repro when you see:
```
# This one hangs on all versions <= 0.10.2 so we run it last
node index.js --format json features/promise-example.feature
Unhandled rejection TypeError: Converting circular structure to JSON
    at Object.stringify (native)
    at done (C:\dev\node\cucumber-js-fails-when-step-error-is-not-exception\node_modules\cucumber\node_modules\gherkin\lib\gherkin\formatter\json_formatter.js:7:23)
```

## Analysis

There are two issues with cucumber-js demonstrated here.

1.  cucumber-js fails due to assumptions about the type of an error from a step.
    In cucumber 9.5 and 10.2 the JSON formatter assumes the object is an exception or is `JSON.stringify`'able.
    This happens at https://github.com/cucumber/cucumber-js/blob/v0.10.2/lib/cucumber/listener/json_formatter.js#L147
    The `gherkinJsonFormatter` ultimately calls `JSON.stringify` on `stepOutput.error_message`.

    In cucumber 9.5 the pretty formatter assumes that the object is an exception or a string.
    https://github.com/cucumber/cucumber-js/blob/v0.9.5/lib/cucumber/listener/pretty_formatter.js#L130
    `failureDescription` is passed to `self.logIndented` which calls `self.indent` which does a `.split()`
    on `failureDescription`.
    In cucumber 10.2 the pretty formatter had some changes and no longer does this but instead formats
    the error using the colors lib, which coerces the object to string.

    This problem occurs regardless of what results mechanism is used (cb / blocking / promise).
    I ran into it with the Promise form, as throwing objects that aren't Error seems less common than
    rejecting Promises with non-Errors.

2.  When cucumber-js fails, it does not call the callback passed to Cli.run, leaving the caller unaware of failure.
    With the blocking or callback steps this cause an unhandled exception.
    But with the Promise steps, this causes an unhandled rejection, which is not fatal and can leave the program hanging.

## Proposed Solution

To solve problem #1 generally I propose we coerce the error's type as soon as it comes from the step,
at https://github.com/cucumber/cucumber-js/blob/v0.10.2/lib/cucumber/support_code/step_definition.js#L75,
this allows the type returned by `stepResult.getFailureException()` to always be an exception or string.
If this solution seems reasonable I'll open a PR.

To solve #2 is a bit trickier. I don't have a good suggestion for generally solving it yet. I would appreciate thoughts.





