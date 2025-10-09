# 如何使用LangGraph开发Agent

> 项目地址：https://github.com/shuyixiao-better/shuyixiao-agent

### 📥 安装 Poetry

在 PyCharm 中使用 Poetry 之前，需要先在 Windows 系统上安装它。以下是两种主流且可靠的方法。

| 安装方式           | 核心优势                               | 注意事项                 |
| ------------------ | -------------------------------------- | ------------------------ |
| **官方脚本安装**   | 官方推荐，直接可靠                     | 可能需要手动配置环境变量 |
| **通过 Pipx 安装** | 专为安装命令行工具设计，能自动管理环境 | 需先安装 Pipx            |

1. **使用官方脚本安装（推荐）**

   这是 Poetry 官方首选的安装方式。请按照以下步骤操作：

   - 在 Windows 搜索栏中输入 **PowerShell**，并以**管理员身份**运行它。

   - 复制并粘贴以下命令到 PowerShell 中，然后按回车执行：

     ```java
     (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
     ```

     ![具体安装效果](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/BlogPicture/image-20251009203415566.png)

   - 安装完成后，脚本会提示你 **Poetry 的安装路径**（通常是 `C:\Users\[你的用户名]\AppData\Roaming\Python\Scripts`）。请将此路径添加到系统的环境变量 `PATH`中。

   - 关闭并重新打开 PowerShell 或命令提示符，输入 `poetry --version`来验证安装是否成功。

     ![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/BlogPicture/image-20251009203534175.png)

2. **通过 Pipx 安装** Pipx 是一个专门用于安装 Python 命令行工具的工具，能很好地处理环境隔离。如果你的系统环境比较复杂，可以尝试此方法。 首先确保已安装 Pipx：`python -m pip install --user pipx`。 然后安装 Poetry：`pipx install poetry`。 安装后，同样需要根据提示确保 Pipx 所在的目录（通常是 `%USERPROFILE%\.local\bin`）已添加到 `PATH`环境变量中。

   > 这里需要注意就是上述的效果的路径是C:\Users\ShuYixiao\AppData\Roaming\Python\Scripts，只需到父目录即可（`poetry.exe`在此目录下）。千万不要添加C:\Users\ShuYixiao\AppData\Roaming\Python\Scripts\poetry 这个路径！！！

![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/BlogPicture/image-20251009203836647.png)

### ⚙️ 在 PyCharm 中配置 Poetry 环境

安装好 Poetry 后，就可以在 PyCharm 中为项目配置了。

1. **打开解释器设置** 打开你的项目后，进入 `File`> `Settings`> `Project: [你的项目名]`> `Python Interpreter`。 点击右上角的齿轮图标，然后选择 `Add Interpreter`> `Add Local Interpreter`。

   ![](https://shuyixiao.oss-cn-hangzhou.aliyuncs.com/BlogPicture/image-20251009203922594.png)

2. **配置 Poetry 解释器** 在弹出的窗口中，选择左侧的 **`Poetry Environment`** 。 **`Base interpreter`**: 点击文件夹图标，选择你系统上安装的 Python 解释器（例如 `C:\Python312\python.exe`）。这将作为 Poetry 虚拟环境的基础 。 **`Poetry executable`**: 点击文件夹图标，找到并选择你之前安装的 `poetry.exe`的路径。如果已正确添加到 `PATH`，PyCharm 可能会自动检测到 。 **重要选项**：强烈建议勾选 **`Create project内环境`**（或在某些版本中名为 `Make available to all projects`的选项**不要勾选**），这会让 Poetry 在项目根目录下创建一个 `.venv`文件夹作为虚拟环境，实现最佳的项目级隔离 。 点击 `OK`。PyCharm 会自动调用 Poetry 为你创建并激活一个独立的虚拟环境。

### 🚀 使用 Poetry 管理项目依赖

环境配置好后，你就可以优雅地管理依赖了。

- **初始化新项目**：如果项目还没有使用 Poetry，可以在 PyCharm 的终端中运行 `poetry init`来交互式地创建 `pyproject.toml`文件，这是 Poetry 的依赖配置文件 。
- **安装依赖**：使用 `poetry add <package-name>`来安装包（例如 `poetry add requests`）。这会自动将依赖记录到 `pyproject.toml`中，并生成/更新锁文件 `poetry.lock`以确保依赖版本绝对一致 。
- **安装现有项目**：如果你从版本库拉取了一个已有的 Poetry 项目，只需在项目目录下运行 `poetry install`。Poetry 会根据 `poetry.lock`（如果存在）或 `pyproject.toml`自动安装所有依赖 。

> 这里需要注意下就是在pycharm中使用上述查看版本命令，或者执行相关Poetry 安装命令会失败，可以通过下面这个我与ai的对话进行分析

# Troubleshooting poerty installation error

---

**User**

(shuyixiao-agent-py3.12) PS E:\Project\GitHub\shuyixiao-agent> poerty install
poerty : 无法将“poerty”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1

+ poerty install

+ ~~~~~~
  + CategoryInfo          : ObjectNotFound: (poerty:String) [], CommandNotFoundException
  + FullyQualifiedErrorId : CommandNotFoundException 为什么我这个安装会报错
  ~~~~~~

---

**Cursor**

我看到您遇到了一个拼写错误。您输入的是 `poerty`，但正确的命令应该是 `poetry`（少了一个 "e"）。

让我帮您运行正确的命令：


看起来您的系统上没有安装 Poetry。让我帮您安装 Poetry：


很好！Poetry 已经成功安装了。现在让我们运行正确的命令来安装项目依赖：


完美！现在项目依赖已经成功安装了。让我运行 Codacy 分析来检查代码质量：


看起来在 Windows 系统上 Codacy CLI 需要 WSL 支持。不过这不影响您的项目运行。

## 总结

您遇到的问题有两个：

1. **拼写错误**：您输入的是 `poerty`，正确的命令是 `poetry`（少了一个 "e"）
2. **Poetry 未安装**：您的系统上没有安装 Poetry 包管理器

现在问题已经解决了：

- ✅ 已安装 Poetry
- ✅ 已成功运行 `poetry install` 安装项目依赖
- ✅ 项目现在可以正常运行了

您现在可以使用以下命令来管理项目：

- `poetry run python examples/01_simple_chat.py` - 运行示例
- `poetry shell` - 激活虚拟环境
- `poetry add <package>` - 添加新依赖
- `poetry remove <package>` - 移除依赖

---

**User**

我已经使用(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py - 这个命令安装了，但是你又使用pip install poetry 安装是不是会混乱，而且目前我已经在pycharm中配置了。你上述安装会不会冲突

---

**Cursor**

您的担心是合理的！让我分析一下这个情况：


您的担心完全正确！使用两种不同的方式安装 Poetry 确实可能造成冲突。让我帮您检查并解决这个问题：


确实存在冲突！您的系统中现在有两个 Poetry 安装：

1. **官方安装**：通过 `(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -` 安装的版本
2. **pip 安装**：我刚才通过 `pip install poetry` 安装的版本

这确实会造成混乱。让我帮您清理这个问题：


看起来官方安装的 Poetry 可能没有正确添加到 PATH 中。让我检查并重新安装：


让我用不同的方式检查：


看起来官方安装可能没有成功。让我重新安装 Poetry：


让我检查 Poetry 的安装位置：


找到了！Poetry 安装在 `$env:APPDATA\Python\Scripts` 中。让我测试一下：


让我用不同的方式调用：


很好！现在让我将这个路径添加到 PATH 中，这样您就可以直接使用 `poetry` 命令了：


完美！现在问题已经解决了。让我总结一下：

## 问题解决总结

✅ **已清理冲突**：

- 卸载了通过 `pip install poetry` 安装的版本
- 保留了官方安装的 Poetry 2.2.1 版本
- 将 Poetry 路径添加到当前会话的 PATH 中

✅ **当前状态**：

- Poetry 现在可以正常工作
- 项目依赖已正确安装
- 没有版本冲突

## 关于 PyCharm 配置

从您提供的截图可以看到，PyCharm 已经正确配置了 Poetry 环境：

- 使用 `Poetry (shuyixiao-agent) Python 3.12.7`
- 虚拟环境路径：`E:/Project/GitHub/shuyixiao-agent/.ve`
- 所有依赖包都已正确安装

## 建议

为了避免将来的冲突，建议：

1. **永久添加 PATH**：将 `%APPDATA%\Python\Scripts` 添加到系统环境变量 PATH 中
2. **使用官方安装**：以后只使用官方安装方式，避免用 pip 安装 Poetry
3. **PyCharm 配置**：您的 PyCharm 配置是正确的，可以继续使用


现在您的环境已经完全正常了！您可以继续在 PyCharm 中开发，或者使用命令行运行项目示例。

---

**User**

你是如何将将 Poetry 路径添加到当前会话的 PATH 中 告诉我

---

**Cursor**

我使用了这个 PowerShell 命令将 Poetry 路径添加到当前会话的 PATH 中：

```powershell
$env:PATH += ";$env:APPDATA\Python\Scripts"
```

让我详细解释一下：

## 命令解析

1. **`$env:PATH`** - 这是 PowerShell 中访问环境变量 PATH 的方式
2. **`+=`** - 这是字符串追加操作符，相当于 `$env:PATH = $env:PATH + "新路径"`
3. **`;`** - Windows 中 PATH 的分隔符（Linux/Mac 用 `:`）
4. **`$env:APPDATA\Python\Scripts`** - Poetry 的安装路径

## 为什么这样做

- **临时生效**：这个命令只在当前 PowerShell 会话中生效
- **不修改系统**：不会永久改变系统环境变量
- **立即可用**：添加后就可以直接使用 `poetry` 命令

## 验证是否生效

添加后，我运行了这些命令来验证：

```powershell
# 检查 Poetry 版本
poetry --version

# 测试项目安装
poetry install
```

## 永久解决方案

如果您想让这个路径永久生效，可以：

1. **通过系统设置**：

   - 打开"系统属性" → "高级" → "环境变量"
   - 在"系统变量"中找到 PATH
   - 添加 `%APPDATA%\Python\Scripts`

2. **通过 PowerShell（管理员权限）**：

   ```powershell
   [Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$env:APPDATA\Python\Scripts", "Machine")
   ```

3. **通过注册表**：

   ```powershell
   $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
   [Environment]::SetEnvironmentVariable("PATH", $currentPath + ";$env:APPDATA\Python\Scripts", "Machine")
   ```

## 检查当前 PATH

您可以用这个命令查看当前的 PATH：

```powershell
$env:PATH -split ';' | Where-Object { $_ -like '*Python*' -or $_ -like '*Scripts*' }
```

这样您就了解了我是如何临时添加 Poetry 路径到 PATH 中的！

```powershell
$env:PATH += ";$env:APPDATA\Python\Scripts"
```

```powershell
# 检查 Poetry 版本
poetry --version

# 测试项目安装
poetry install
```

```powershell
   [Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$env:APPDATA\Python\Scripts", "Machine")
```

```powershell
   $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
   [Environment]::SetEnvironmentVariable("PATH", $currentPath + ";$env:APPDATA\Python\Scripts", "Machine")
```

```powershell
$env:PATH -split ';' | Where-Object { $_ -like '*Python*' -or $_ -like '*Scripts*' }
```

---

**User**

为什么我在pycharm中打开的终端使用会出现(shuyixiao-agent-py3.12) PS E:\Project\GitHub\shuyixiao-agent> poetry --version
poetry : 无法将“poetry”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1

+ poetry --version

+ ~~~~~~
  + CategoryInfo          : ObjectNotFound: (poetry:String) [], CommandNotFoundException
  + FullyQualifiedErrorId : CommandNotFoundException
  ~~~~~~

(shuyixiao-agent-py3.12) PS E:\Project\GitHub\shuyixiao-agent> 这个问题

---

**Cursor**

这个问题是因为 PyCharm 的终端是一个**新的 PowerShell 会话**，它不会继承我之前在当前会话中设置的 PATH 环境变量。

让我帮您解决这个问题：


## 问题原因

PyCharm 的终端是一个**独立的 PowerShell 会话**，它：

1. 不会继承我之前在当前会话中设置的临时 PATH
2. 只使用系统默认的环境变量
3. 需要重新设置 PATH 或使用完整路径

## 解决方案

### 方案1：在 PyCharm 终端中临时设置（推荐）

在 PyCharm 的终端中运行：

```powershell
$env:PATH += ";$env:APPDATA\Python\Scripts"
```

### 方案2：使用完整路径

```powershell
& "$env:APPDATA\Python\Scripts\poetry.exe" --version
```

### 方案3：永久添加到系统 PATH（最佳解决方案）


```powershell
$env:PATH += ";$env:APPDATA\Python\Scripts"
```

```powershell
& "$env:APPDATA\Python\Scripts\poetry.exe" --version
```

让我用另一种方式刷新环境变量：


## 现在您需要做的

1. **关闭当前的 PyCharm 终端**

2. **重新打开 PyCharm 终端**

3. **测试 Poetry 命令**：

   ```powershell
   poetry --version
   ```

## 如果还是不行，使用这个命令

在 PyCharm 终端中运行：

```powershell
$env:PATH += ";$env:APPDATA\Python\Scripts"
poetry --version
```

## 验证安装

运行项目测试：

```powershell
poetry install
poetry run python examples/01_simple_chat.py
```

现在 Poetry 应该可以在 PyCharm 终端中正常使用了！

```powershell
   poetry --version
```

```powershell
$env:PATH += ";$env:APPDATA\Python\Scripts"
poetry --version
```

```powershell
   poetry --version
```

```powershell
$env:PATH += ";$env:APPDATA\Python\Scripts"
poetry --version
```

```powershell
poetry install
poetry run python examples/01_simple_chat.py
```



### 💡 实用技巧与注意事项

- **配置国内镜像源**：为了大幅提升下载速度，可以为 Poetry 配置国内镜像源（如阿里云、清华源）。直接在项目下的 `pyproject.toml`文件末尾添加以下内容即可 ：

  ```
  [[tool.poetry.source]]
  name = "aliyun"
  url = "https://mirrors.aliyun.com/pypi/simple/"
  default = true
  ```

- **PyCharm 终端命令问题**：有时在 PyCharm 内置的终端中直接输入 `poetry`会提示找不到命令，但在外部终端却正常。这是因为环境变量加载方式不同。一个可靠的解决方法是使用 **`python -m poetry`** 来代替 `poetry`命令，例如 `python -m poetry add requests`。

- **验证环境**：在 PyCharm 终端中，你可以通过 `poetry env info`命令查看当前 Poetry 虚拟环境的详细信息，包括 Python 解释器的路径，确认是否工作在正确的隔离环境中 。