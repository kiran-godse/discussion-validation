const core = require("@actions/core");
const github = require("@actions/github");

try {
  // const commentBody = github.context.payload.comment.body;
  const discussionId = github.context.payload.discussion.id;
  const discussionNodeId = github.context.payload.discussion.node_id;
  const discussionBody = github.context.payload.discussion.body;

  // console.log(`Comment Body: ${commentBody}`);
  console.log(`Discussion ID: ${discussionId}`);
  console.log(`Discussion Node ID: ${discussionNodeId}`);
  console.log(`Discussion Body: ${discussionBody}`);

  // Construct the GraphQL query
  const query = `
    query {
      repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
        discussion(number: ${discussionId}) {
          title
          body
          labels(first: 10) {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  // Make a request to the GitHub GraphQL API using octokit
  const octokit = github.getOctokit(core.getInput("PAT")); // Assuming you pass your repository token as an input

  // Use .graphql instead of .graphql.query for making the request
  octokit.graphql(query).then((response) => {
    // Extract labels from the response
    const discussionLabels = response.repository.discussion.labels.nodes.map(
      (node) => node.name
    );
    console.log("Discussion Labels:", discussionLabels);

    // Set an output for the comment body, discussion ID, discussion body, and labels
    core.setOutput("comment_body", commentBody);
    core.setOutput("disc_ID", discussionNodeId);
    core.setOutput("disc_body", discussionBody);
    core.setOutput("disc_labels", discussionLabels.join(", "));
  });
} catch (error) {
  core.setFailed(error.message);
}
